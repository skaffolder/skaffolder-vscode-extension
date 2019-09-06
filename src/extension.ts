// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProvider } from "./treeProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(data: vscode.ExtensionContext) {
  let skObject = [
    {
      name: "Film",
      pos: 34,
      _attr: [
        {
          name: "title",
          pos: 37
        },
        {
          name: "year",
          pos: 40
        }
      ]
    },
    {
      name: "Actor",
      pos: 45,
      _attr: []
    }
  ];

  const jsonOutlineProvider = new TreeProvider(skObject);

  vscode.window.registerTreeDataProvider(
    "skaffolderExplorer",
    jsonOutlineProvider
  );
  // vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
  // vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
  // // vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
  // vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));
}
// this method is called when your extension is deactivated
export function deactivate() {}
