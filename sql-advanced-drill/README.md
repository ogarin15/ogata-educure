# SQL Advanced Drill

SQLの応用的な操作と、実行計画・インデックス・トランザクション・制約・論理削除・ページングについて学習する。

## 構成

- 00-bulk-data.sql
  - 問1で使用する大量データを作成するSQL

- answers.sql
  - 問1〜問10の解答SQL

- explain-results/
  - EXPLAIN ANALYZEの実行結果を保存するフォルダ

## 学習内容

### Phase 1
大量データを作成し、インデックスによる検索速度の変化を確認する。

### Phase 2
複合インデックスの使われ方を確認する。

### Phase 3
トランザクションとROLLBACKを確認する。

### Phase 4
SAVEPOINTを使用した部分的なロールバックを確認する。

### Phase 5
トランザクション分離レベルを確認する。

### Phase 6
NOT NULLやCHECK制約を追加し、データの整合性を保証する。

### Phase 7
トリガーによるupdated_atの自動更新と論理削除を確認する。

### Phase 8
OFFSET方式とカーソル方式のページングを比較する。