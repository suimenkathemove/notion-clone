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

<!-- TODO -->

## 子の一覧の取得

<!-- TODO -->

## 先祖の一覧の取得

<!-- TODO -->

## 子孫の一覧の取得

<!-- TODO -->

## 追加

<!-- TODO -->

## 削除

<!-- TODO -->

## 先祖-子孫間、兄弟間の移動

<!-- TODO -->
