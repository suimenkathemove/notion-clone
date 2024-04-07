# BackendサーバをVSCode Debuggerでデバッグする方法

devcontainerを使うことで、Docker Containerの中のプロセスに対してdebuggerでデバッグすることができる。

## 設定

- [.devcontainer/devcontainer.json](https://github.com/suimenkathemove/notion-clone/blob/main/.devcontainer/devcontainer.json)
- [.vscode/launch.json](https://github.com/suimenkathemove/notion-clone/blob/main/.vscode/launch.json)

## 手順

1. Backend APIを起動する
2. Command Paletteで`Dev Containers: Reopen in Container`を実行する
3. Debuggerで`Attach 'backend'`を選択する
4. `/app/target/debug/backend`のprocessを選択する

## 参考

- <https://daveceddia.com/debug-electron-native-rust-with-vscode/>
