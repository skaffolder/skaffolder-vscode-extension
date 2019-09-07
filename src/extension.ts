// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "skaffolder.openmodel",
      async (confiFilePath: vscode.Uri, files: vscode.Uri[]) => {
        // TODO: open file config

        try {
          await vscode.commands.executeCommand<vscode.Location[]>(
            "vscode.open",
            confiFilePath
          );
        } catch (e) {
          console.error(e);
        }

        // open file source
        await vscode.commands.executeCommand<vscode.Location[]>(
          "workbench.action.quickOpen",
          files
        );
      }
    )
  );

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
}

// this method is called when your extension is deactivated
export function deactivate() {}
