# SQLで木構造を扱う(閉包テーブル)

## はじめに

SQLを使用して、ディレクトリやNotionアプリのページのような木構造で以下の機能を実装したい。

- 取得
  - ルートの一覧の取得
  - 子の一覧の取得
  - 先祖の一覧の取得
  - 子孫の一覧の取得
- 追加
- 削除
- 移動
  - 先祖-子孫間、兄弟間の移動

今回は閉包テーブル(Closure Table)というデータ構造で実装していく。

## 閉包テーブルとは

閉包テーブルとは、木構造内の各ノードにおいて、先祖-子孫間の関係(自身も含む)を格納するテーブルのことである。

例えば以下のような木構造がある場合、

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

上から、ノードのテーブル、先祖-子孫間の関係のテーブル、兄弟間の関係のテーブルになる。

## ルートの一覧の取得

先の木構造で考えると、期待する結果は以下のようになる。

| name |
| ---- |
| 1    |
| 2    |
| 3    |

ルートは、子孫を持たないノードである。
閉包テーブルでは自身と自身の関係も含めるので、子孫を1つしか持たないノードということになる。
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

<!-- TODO -->

## 追加

<!-- TODO -->

## 削除

<!-- TODO -->

## 先祖-子孫間、兄弟間の移動

<!-- TODO -->
