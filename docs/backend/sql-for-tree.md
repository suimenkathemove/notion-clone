# SQLで木構造を扱う(閉包テーブル)

## はじめに

SQLを使用して、ディレクトリのような木構造で以下の機能を実装したい。

- 取得
  - ルートの一覧の取得
  - 子の一覧の取得
  - 先祖の一覧の取得
  - 子孫の一覧の取得
- 追加
- 削除
- 移動

今回は閉包テーブル(Closure Table)というデータ構造で実装していく。

## 閉包テーブルとは

閉包テーブルとは、木構造内の各ノードにおいて、先祖-子孫間の関係(自身も含む)を格納するテーブルのことである。
この記事では以下のような木構造を扱う。

- 1
  - 1-1
    - 1-1-1
  - 1-2
  - 1-3
- 2
- 3

先祖-子孫間の閉包テーブルは以下のようになる。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 1-1        | 1      |
| 1        | 1-2        | 1      |
| 1        | 1-3        | 1      |
| 1        | 1-1-1      | 2      |
| 2        | 2          | 0      |
| 3        | 3          | 0      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-1-1      | 1      |
| 1-2      | 1-2        | 0      |
| 1-3      | 1-3        | 0      |
| 1-1-1    | 1-1-1      | 0      |

ancestorは先祖、descendantは子孫、weightは重みである。

今回は兄弟間の順序も保持したい。
長男をルート、末っ子をリーフとして考えると、兄弟間の閉包テーブルは以下のようになる。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 2          | 1      |
| 1        | 3          | 2      |
| 2        | 2          | 0      |
| 2        | 3          | 1      |
| 3        | 3          | 0      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-2        | 1      |
| 1-1      | 1-3        | 2      |
| 1-2      | 1-2        | 0      |
| 1-2      | 1-3        | 1      |
| 1-3      | 1-3        | 0      |
| 1-1-1    | 1-1-1      | 0      |

## テーブル定義

今回はPostgreSQLで実装する。
テーブル定義は以下のようになる。

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
);

CREATE TABLE node_relationships (
  ancestor UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  descendant UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL CHECK (weight >= 0),
  PRIMARY KEY (ancestor, descendant)
);

CREATE TABLE node_sibling_relationships (
  ancestor UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  descendant UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL CHECK (weight >= 0),
  PRIMARY KEY (ancestor, descendant)
);
```

上からノードのテーブル、先祖-子孫間の関係のテーブル、兄弟間の関係のテーブルになる。

## ルートの一覧の取得

先の木構造で考えると、期待する結果は以下のようになる。

| name |
| ---- |
| 1    |
| 2    |
| 3    |

ルートは、子孫を持たないノードである。
閉包テーブルでは自身と自身との関係も含むので、子孫を1つしか持たないノードということになる。
よって、ルートの一覧のidを取得するSQLは以下のようになる。

```sql
SELECT
  descendant AS id
FROM
  node_relationships
GROUP BY
  descendant
HAVING
  COUNT(*) = 1
```

これを長男から順に並べ替えるには、node_sibling_relationshipsテーブルで、descendantごとにグループ化し、descendantの数が少ない順に並べ替えればよい。
descendantの数を取得するSQLは以下のようになる。

```sql
SELECT
  descendant,
  COUNT(*) AS count
FROM
  node_sibling_relationships
GROUP BY
  descendant
```

これらを組み合わせると、ルートの一覧を取得するSQLは以下のようになる。

```sql
WITH roots AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  GROUP BY
    descendant
  HAVING
    COUNT(*) = 1
),
sibling_descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_sibling_relationships
  GROUP BY
    descendant
)
SELECT
  name
FROM
  nodes
  JOIN roots ON nodes.id = roots.id
  JOIN sibling_descendant_counts ON nodes.id = sibling_descendant_counts.descendant
ORDER BY
  sibling_descendant_counts.count
```

## 子の一覧の取得

例えば`1`のノードの子の一覧の場合、期待する結果は以下のようになる。

| name |
| ---- |
| 1-1  |
| 1-2  |
| 1-3  |

子は、ancestorが親のidで、weightが1の、descendantのノードである。
よって、子の一覧のidを取得するSQLは以下のようになる。

```sql
SELECT
  descendant AS id
FROM
  node_relationships
WHERE
  ancestor = $1
  AND weight = 1
```

※$1は任意のノードのid

これを使うと、子の一覧を取得するSQLは以下のようになる。

```sql
WITH children AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  WHERE
    ancestor = $1
    AND weight = 1
),
sibling_descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_sibling_relationships
  GROUP BY
    descendant
)
SELECT
  name
FROM
  nodes
  JOIN children ON nodes.id = children.id
  JOIN sibling_descendant_counts ON nodes.id = sibling_descendant_counts.descendant
ORDER BY
  sibling_descendant_counts.count
```

※$1は任意のノードのid

## 先祖の一覧の取得

例えば`1-1-1`のノードの先祖の一覧の場合、期待する結果は以下のようになる。

| name |
| ---- |
| 1    |
| 1-1  |

先祖の一覧を取得するSQLは以下のようになる。

```sql
SELECT
  name
FROM
  nodes
  JOIN node_relationships ON nodes.id = node_relationships.ancestor
  AND node_relationships.descendant = $1
  AND node_relationships.ancestor != $1
ORDER BY
  node_relationships.weight DESC
```

※$1は任意のノードのid

## 子孫の一覧の取得

例えば`1`のノードの子孫の一覧の場合、期待する結果は以下のようになる。
今回はそのノード自身も含めることにする。

| name  |
| ----- |
| 1     |
| 1-1   |
| 1-2   |
| 1-3   |
| 1-1-1 |

子の一覧の取得を応用すると、子孫の一覧を取得するSQLは以下のようになる。

```sql
WITH descendants AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  WHERE
    ancestor = $1
),
descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_relationships
  GROUP BY
    descendant
),
sibling_descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_sibling_relationships
  GROUP BY
    descendant
)
SELECT
  name
FROM
  nodes
  JOIN descendants ON nodes.id = descendants.id
  JOIN descendant_counts ON nodes.id = descendant_counts.descendant
  JOIN sibling_descendant_counts ON nodes.id = sibling_descendant_counts.descendant
ORDER BY
  descendant_counts.count,
  sibling_descendant_counts.count
```

※$1は任意のノードのid

以下のような入れ子の構造を作りたい場合は、

```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "name": "1",
  "children": [
    {
      "id": "00000000-0000-0000-0000-000000000011",
      "name": "1-1",
      "children": [
        {
          "id": "00000000-0000-0000-0000-000000000111",
          "name": "1-1-1",
          "children": []
        }
      ]
    },
    {
      "id": "00000000-0000-0000-0000-000000000012",
      "name": "1-2",
      "children": []
    },
    {
      "id": "00000000-0000-0000-0000-000000000013",
      "name": "1-3",
      "children": []
    }
  ]
}
```

任意のノードからリーフまでの親子関係が必要になる。
具体的には以下のようなデータである(実際には、idにはそれぞれuuidが入る)。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1-1        | 1      |
| 1        | 1-2        | 1      |
| 1        | 1-3        | 1      |
| 1-1      | 1-1-1      | 1      |

これを取得するには、以下の2つの方法がある。

```sql
WITH descendants AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  WHERE
    ancestor = $1
),
parent_child_relationships AS (
  SELECT
    ancestor,
    descendant,
    weight
  FROM
    node_relationships
  WHERE
    ancestor IN (
      SELECT
        id
      FROM
        descendants
    )
    AND weight = 1
)
```

※$1は任意のノードのid

```sql
WITH RECURSIVE parent_child_relationships AS (
  SELECT
    ancestor,
    descendant,
    weight
  FROM
    node_relationships
  WHERE
    ancestor = $1
    AND weight = 1
  UNION
  ALL
  SELECT
    child.ancestor,
    child.descendant,
    child.weight
  FROM
    parent_child_relationships
    JOIN node_relationships AS child ON parent_child_relationships.descendant = child.ancestor
    AND child.weight = 1
)
```

※$1は任意のノードのid

1つ目の方法は、任意のノードの子孫の一覧を取得し、その子孫のそれぞれの子の一覧を取得している。
2つ目の方法は、任意のノードの子の一覧を取得し、`WITH RECURSIVE`を使用して再帰的にまたその子の一覧を取得している。
よって、任意のノードからリーフまでの親子関係を取得するSQLは以下のようになる。

```sql
WITH RECURSIVE parent_child_relationships AS (
  SELECT
    ancestor,
    descendant,
    weight
  FROM
    node_relationships
  WHERE
    ancestor = $1
    AND weight = 1
  UNION
  ALL
  SELECT
    child.ancestor,
    child.descendant,
    child.weight
  FROM
    parent_child_relationships
    JOIN node_relationships AS child ON parent_child_relationships.descendant = child.ancestor
    AND child.weight = 1
),
descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_relationships
  GROUP BY
    descendant
),
sibling_descendant_counts AS (
  SELECT
    descendant,
    COUNT(*) AS count
  FROM
    node_sibling_relationships
  GROUP BY
    descendant
)
SELECT
  parent_child_relationships.ancestor,
  parent_child_relationships.descendant,
  parent_child_relationships.weight
FROM
  parent_child_relationships
  JOIN descendant_counts ON parent_child_relationships.descendant = descendant_counts.descendant
  JOIN sibling_descendant_counts ON parent_child_relationships.descendant = sibling_descendant_counts.descendant
ORDER BY
  descendant_counts.count,
  sibling_descendant_counts.count
```

※$1は任意のノードのid

これらのSQLで取得したデータからツリーを組み立てるTypeScriptのコードは以下のようになる。

```ts
interface Node {
  id: string;
  name: string;
}

interface NodeRelationship {
  ancestor: string;
  descendant: string;
  weight: number;
}

interface Tree {
  id: string;
  name: string;
  children: Tree[];
}

const buildTree = (
  nodes: Node[],
  parentChildRelationships: NodeRelationship[],
  rootId: string,
): Tree => {
  const treeMap = new Map<string, Tree>(
    nodes.map((n) => [n.id, { ...n, children: [] }]),
  );

  parentChildRelationships.forEach((r) => {
    const parent = treeMap.get(r.ancestor)!;
    const child = treeMap.get(r.descendant)!;
    parent.children.push(child);
  });

  return treeMap.get(rootId)!;
};
```

## 追加

例えば以下のような木構造を作る場合、

- 1
  - 1-1
    - 1-1-1
  - 1-2
  - 1-3
- 2
- 3

nodesテーブル、node_relationshipsテーブル、node_sibling_relationshipsテーブルのデータはそれぞれ以下のようになる。

nodes
| id    | name  |
| ----- | ----- |
| 1     | 1     |
| 2     | 2     |
| 3     | 3     |
| 1-1   | 1-1   |
| 1-2   | 1-2   |
| 1-3   | 1-3   |
| 1-1-1 | 1-1-1 |

node_relationships
| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 1-1        | 1      |
| 1        | 1-2        | 1      |
| 1        | 1-3        | 1      |
| 1        | 1-1-1      | 2      |
| 2        | 2          | 0      |
| 3        | 3          | 0      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-1-1      | 1      |
| 1-2      | 1-2        | 0      |
| 1-3      | 1-3        | 0      |
| 1-1-1    | 1-1-1      | 0      |

node_sibling_relationships
| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 2          | 1      |
| 1        | 3          | 2      |
| 2        | 2          | 0      |
| 2        | 3          | 1      |
| 3        | 3          | 0      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-2        | 1      |
| 1-1      | 1-3        | 2      |
| 1-2      | 1-2        | 0      |
| 1-2      | 1-3        | 1      |
| 1-3      | 1-3        | 0      |
| 1-1-1    | 1-1-1      | 0      |

### nodes

まず、nodesテーブルにデータを挿入する。

```sql
INSERT INTO
  nodes (name)
VALUES
  ($1) RETURNING id,
  name
```

※$1はname

### node_relationships

次に、node_relationshipsテーブルにデータを挿入する。
挿入するデータは、「追加するノード」自身との関係と、「追加先のノード」の先祖と「追加するノード」との関係である。
例えば、`1-1-1`のノードを`1-1`のノードに追加する場合を考える。
追加する`1-1-1`のノード自身との関係は(1-1-1, 1-1-1, 0)である。
追加先の`1-1`のノードの先祖は、`1`のノード、`1-1`のノードである。
これらと、追加する`1-1-1`のノードとの関係は、(1, 1-1-1)、(1-1, 1-1-1)になる。
重みに関しては、追加先の`1-1`のノードの子になるので、追加先のノードの先祖と追加先のノードとの関係のweightをインクリメントした値になる。
具体的には、(1, 1-1, 1)、(1-1, 1-1, 0)をインクリメントした値になるので、(1, 1-1-1, 2)、(1-1, 1-1-1, 1)になる。
最終的に挿入するデータは、(1, 1-1-1, 2)、(1-1, 1-1-1, 1)、(1-1-1, 1-1-1, 0)になる。
よって、SQLは以下のようになる。

```sql
INSERT INTO
  node_relationships (ancestor, descendant, weight)
SELECT
  ancestor,
  $2,
  weight + 1
FROM
  node_relationships
WHERE
  descendant = $1
UNION
ALL
SELECT
  $2,
  $2,
  0
```

※$1は追加先のノードのid、$2は追加するノードのid

### node_sibling_relationships

最後に、node_sibling_relationshipsテーブルにデータを挿入する。
ルートに追加する場合はルートの末っ子、追加先のノードがある場合は追加先のノードの子の末っ子を親として追加すればよい。
具体的には、`3`のノードを追加する場合は`2`のノードを、`1-3`のノードを追加する場合は`1-2`のノードを親として追加する。

ルートの末っ子のidを取得するSQLは以下のようになる。

```sql
WITH roots AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  GROUP BY
    descendant
  HAVING
    COUNT(*) = 1
),
sibling_leaves AS (
  SELECT
    ancestor AS id
  FROM
    node_sibling_relationships
  GROUP BY
    ancestor
  HAVING
    COUNT(*) = 1
)
SELECT
  nodes.id,
  name
FROM
  nodes
  JOIN roots ON nodes.id = roots.id
  JOIN sibling_leaves ON nodes.id = sibling_leaves.id
```

追加先のノードの子の末っ子のidを取得するSQLは以下のようになる。

```sql
WITH children AS (
  SELECT
    descendant AS id
  FROM
    node_relationships
  WHERE
    ancestor = $1
    AND weight = 1
),
sibling_leaves AS (
  SELECT
    ancestor AS id
  FROM
    node_sibling_relationships
  GROUP BY
    ancestor
  HAVING
    COUNT(*) = 1
)
SELECT
  nodes.id,
  name
FROM
  nodes
  JOIN children ON nodes.id = children.id
  JOIN sibling_leaves ON nodes.id = sibling_leaves.id
```

※$1は追加先のノードのid

これらで取得したidのノードを親として追加するSQLは以下のようになる。

```sql
INSERT INTO
  node_sibling_relationships (ancestor, descendant, weight)
SELECT
  ancestor,
  $2,
  weight + 1
FROM
  node_sibling_relationships
WHERE
  descendant = $1
UNION
ALL
SELECT
  $2,
  $2,
  0
```

※$1は取得したid、$2は追加するノードのid

## 削除

### nodes

任意のノードを削除する場合は、そのノードの子孫もすべて削除する必要がある。
よって、SQLは以下のようになる。

```sql
DELETE FROM
  nodes
WHERE
  id IN (
    SELECT
      descendant
    FROM
      node_relationships
    WHERE
      ancestor = $1
  )
```

※$1は任意のノードのid

### node_relationships

`ON DELETE CASCADE`を設定しているので自動的に削除される。

### node_sibling_relationships

`ON DELETE CASCADE`を設定しているので自動的に削除される。
だが、長男でも末っ子でもない間のノードを削除する場合は、削除する前に、移動するノードの先祖(自身を除く)と移動するノードの子孫(自身を除く)間のweightをデクリメントする必要がある。
よって、削除する前に以下のSQLを実行する必要がある。

```sql
UPDATE
  node_sibling_relationships
SET
  weight = weight - 1
WHERE
  ancestor IN (
    SELECT
      ancestor
    FROM
      node_sibling_relationships
    WHERE
      descendant = $1
      AND ancestor != $1
  )
  AND descendant IN (
    SELECT
      descendant
    FROM
      node_sibling_relationships
    WHERE
      ancestor = $1
      AND descendant != $1
  )
```

※$1は任意のノードのid

## 移動

以下の移動先の指定方法のどれかを指定すれば、どの場所にも移動できる。

- ルート
- 親のノード
- 兄のノード
- 弟のノード

### node_relationships

どの指定方法でも、まずは移動するノードのサブツリーを先祖から外す必要がある。
例えば以下のような木構造がある場合、

- 1
  - 1-1
    - 1-1-1

node_relationshipsテーブルは以下のようになる。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 1-1        | 1      |
| 1        | 1-1-1      | 2      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-1-1      | 1      |
| 1-1-1    | 1-1-1      | 0      |

`1-1`のノードを移動する場合、削除する関係は(1, 1-1)、(1, 1-1-1)である。
つまり、ancestorは「移動するノード」以外の「移動するノード」の先祖で、descendantは移動するノードの子孫、の関係を削除すればよい。
よって、SQLは以下のようになる。

```sql
DELETE FROM
  node_relationships
WHERE
  ancestor IN (
    SELECT
      ancestor
    FROM
      node_relationships
    WHERE
      descendant = $1
      AND ancestor != $1
  )
  AND descendant IN (
    SELECT
      descendant
    FROM
      node_relationships
    WHERE
      ancestor = $1
  )
```

※$1は任意のノードのid

次に、外したサブツリーを、移動先のノードを親として追加する。
例えば、先ほど外した`1-1`のサブツリーを、`1-2`のノードを親として追加する場合を考える。
追加前は以下のようになる。

- 1
  - 1-2
- 1-1
  - 1-1-1

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 1-2        | 1      |
| 1-2      | 1-2        | 0      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-1-1      | 1      |
| 1-1-1    | 1-1-1      | 0      |

追加後は以下のようになる。

- 1
  - 1-2
    - 1-1
      - 1-1-1

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 1-2        | 1      |
| 1        | 1-1        | 2      |
| 1        | 1-1-1      | 3      |
| 1-2      | 1-2        | 0      |
| 1-2      | 1-1        | 1      |
| 1-2      | 1-1-1      | 2      |
| 1-1      | 1-1        | 0      |
| 1-1      | 1-1-1      | 1      |
| 1-1-1    | 1-1-1      | 0      |

よって、追加する関係は、(1, 1-1, 2)、(1, 1-1-1, 3)、(1-2, 1-1, 1)、(1-2, 1-1-1, 2)になる。
つまり、追加する関係は、ancestorは移動先のノードの先祖、descendantは移動するノードの子孫になる。
weightに関しては、例えば`1`のノードと`1-1-1`のノード間を考える。
これを並べると、`1`-`1-2`-`1-1`-`1-1-1`になる。
`1`-`1-2`間の重みは1、`1-1`-`1-1-1`間の重みは1、`1-2`-`1-1`間の重みは1である。
つまり、追加する関係のweightは以下のようになる。

```
「移動先のノード」の先祖と「移動先のノード」との重み + 「移動するノード」の子孫と「移動するノード」との重み + 1(移動先のノードと移動するノードとの重み)
```

よって、SQLは以下のようになる。

```sql
INSERT INTO
  node_relationships (ancestor, descendant, weight)
SELECT
  parent.ancestor,
  child.descendant,
  parent.weight + child.weight + 1
FROM
  node_relationships AS parent
  JOIN node_relationships AS child ON parent.descendant = $1
  AND child.ancestor = $2
```

※$1は移動先のノードのid、$2は移動するノードのid

移動先の指定方法で、ルートの場合は、移動先の親はないので実行しない。
兄のノードと弟のノードの場合は、移動先の親はそれぞれの親のノードになる。

### node_sibling_relationships

どの指定方法でも、まずは移動するノードを先祖と子孫から外す必要がある。
例えば以下のような木構造がある場合、

- 1
  - 2
    - 3

node_sibling_relationshipsテーブルは以下のようになる。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 2          | 1      |
| 1        | 3          | 2      |
| 2        | 2          | 0      |
| 2        | 3          | 1      |
| 3        | 3          | 0      |

`2`のノードを移動する場合、削除する関係は(1, 2)、(2, 3)である。
つまり、ancestorは移動するノードの先祖で、descendantは移動するノードの子孫、の関係を削除すればよい(ただし、移動するノード自身との関係は除く)。
よって、SQLは以下のようになる。

```sql
DELETE FROM
  node_sibling_relationships
WHERE
  (
    ancestor = $1
    OR descendant = $1
  )
  AND ancestor != descendant
```

※$1は任意のノードのid

そのまま削除すると`1`-`3`間のweightが2のままになってしまうので、削除する前に、移動するノードの先祖(自身を除く)と移動するノードの子孫(自身を除く)間のweightをデクリメントする必要がある。
よって、削除する前に以下のSQLを実行する必要がある。

```sql
UPDATE
  node_sibling_relationships
SET
  weight = weight - 1
WHERE
  ancestor IN (
    SELECT
      ancestor
    FROM
      node_sibling_relationships
    WHERE
      descendant = $1
      AND ancestor != $1
  )
  AND descendant IN (
    SELECT
      descendant
    FROM
      node_sibling_relationships
    WHERE
      ancestor = $1
      AND descendant != $1
  )
```

※$1は任意のノードのid

次に、外したノードを、移動先のノードを親として追加する。
追加する方法は、以下の3つのパターンに分けられる。

- ルート、親のノード
- 兄のノード
- 弟のノード

ルートの場合はルートの末っ子を、親のノードの場合は親のノードの子の末っ子を親として追加することにする。
追加先のノードを取得した後は、以下のSQLで追加する。

```sql
INSERT INTO
  node_sibling_relationships (ancestor, descendant, weight)
SELECT
  ancestor,
  $2,
  weight + 1
FROM
  node_sibling_relationships
WHERE
  descendant = $1
```

※$1は追加先のノードのid、$2は追加するノードのid

次は、兄のノードの場合を考える。
例えば以下のような木構造がある場合、

- 1
  - 2
    - 3

node_sibling_relationshipsテーブルは以下のようになる。

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 2          | 1      |
| 1        | 3          | 2      |
| 2        | 2          | 0      |
| 2        | 3          | 1      |
| 3        | 3          | 0      |

`1-1`のノードを、`2`のノードを兄として移動した場合は以下のようになる。

- 1
  - 2
    - 1-1
      - 3

| ancestor | descendant | weight |
| -------- | ---------- | ------ |
| 1        | 1          | 0      |
| 1        | 2          | 1      |
| 1        | 1-1        | 2      |
| 1        | 3          | 3      |
| 2        | 2          | 0      |
| 2        | 1-1        | 1      |
| 2        | 3          | 2      |
| 1-1      | 1-1        | 0      |
| 1-1      | 3          | 1      |
| 3        | 3          | 0      |

よって、追加する関係は、(1, 1-1, 2)、(2, 1-1, 1)、(1-1, 3, 1)になる。
ノードの移動機能と、ノードの追加機能の違いは、途中に割り込ませるところである。
具体的には、(1-1, 3, 1)の関係を追加する部分である。
これは追加先のノード(自身を除く)の子孫である。
よって、SQLは以下のようになる。

```sql
INSERT INTO
  node_sibling_relationships (ancestor, descendant, weight)
SELECT
  ancestor,
  $2,
  weight + 1
FROM
  node_sibling_relationships
WHERE
  descendant = $1
UNION
ALL
SELECT
  $2,
  descendant,
  weight
FROM
  node_sibling_relationships
WHERE
  ancestor = $1
  AND descendant != $1
```

※$1は移動先のノードのid、$2は移動するノードのid

弟のノードの場合は、これを逆にしたようなSQLになる。

```sql
INSERT INTO
  node_sibling_relationships (ancestor, descendant, weight)
SELECT
  ancestor,
  $2,
  weight
FROM
  node_sibling_relationships
WHERE
  descendant = $1
  AND ancestor != $1
UNION
ALL
SELECT
  $2,
  descendant,
  weight + 1
FROM
  node_sibling_relationships
WHERE
  ancestor = $1
```

※$1は移動先のノードのid、$2は移動するノードのid

追加後は、先ほどのデクリメントの処理のインクリメント版の処理を行う必要がある。

```sql
UPDATE
  node_sibling_relationships
SET
  weight = weight + 1
WHERE
  ancestor IN (
    SELECT
      ancestor
    FROM
      node_sibling_relationships
    WHERE
      descendant = $1
      AND ancestor != $1
  )
  AND descendant IN (
    SELECT
      descendant
    FROM
      node_sibling_relationships
    WHERE
      ancestor = $1
      AND descendant != $1
  )
```

※$1は任意のノードのid

## 最後に

この方法で、Notionアプリのページ機能の一部を実装した。
<https://github.com/suimenkathemove/monorepo-sandbox/blob/0547ef3fb0a99ad38953a1709e50849b7a91cbd1/backend/src/repositories/postgres/notion/page/mod.rs>

## 参考

- SQLアンチパターン 2.5.3
