// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderApi } from "./providers/treeProviderApi";
import { TreeProviderModel } from "./providers/treeProviderModel";
import { TreeProviderPage } from "./providers/treeProviderPage";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(data: vscode.ExtensionContext) {
  const skaffolderProviderModel = new TreeProviderModel(data);
  const skaffolderProviderApi = new TreeProviderApi(data);
  const skaffolderProviderPage = new TreeProviderPage(data);

  vscode.window.registerTreeDataProvider(
    "skaffolderExplorerModel",
    skaffolderProviderModel
  );

  vscode.window.registerTreeDataProvider(
    "skaffolderExplorerAPI",
    skaffolderProviderApi
  );

  vscode.window.registerTreeDataProvider(
    "skaffolderExplorerPage",
    skaffolderProviderPage
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
