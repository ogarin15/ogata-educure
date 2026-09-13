# psql を起動(パスワードを聞かれるのでインストール時に設定したものを入力)
psql -U <ユーザー名>

# psql のプロンプトが出たら、演習用 DB を作成
postgres=# CREATE DATABASE sql_drill;
postgres=# \q   -- psql を抜ける