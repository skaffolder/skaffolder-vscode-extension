// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(data: vscode.ExtensionContext) {
  const skaffolderProviderModel = new TreeProviderSkaffolder(data, "model");
  const skaffolderProviderApi = new TreeProviderSkaffolder(data, "api");
  const skaffolderProviderPage = new TreeProviderSkaffolder(data, "page");

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
