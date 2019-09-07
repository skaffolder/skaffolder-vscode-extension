// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');

  // Create trees
  const skaffolderProviderModel = new TreeProviderSkaffolder(context, "model");
  const skaffolderProviderApi = new TreeProviderSkaffolder(context, "api");
  const skaffolderProviderPage = new TreeProviderSkaffolder(context, "page");

  // Register trees
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

  // Register commands
  // const commandHandler = async (file: string = "") => {
  //   await vscode.commands.executeCommand<vscode.Location[]>(
  //     "workbench.action.quickOpen",
  //     file
  //   );
  // };

  // context.subscriptions.push(
  //   vscode.commands.registerCommand("skaffolder.openfile", commandHandler)
  // );
}

// this method is called when your extension is deactivated
export function deactivate() {}
