// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";
import { DataService } from "./services/DataService";
import { Commands } from "./utils/Commands";
import { TreeProviderTemplateSkaffolder } from "./providers/treeProviderTemplateSkaffolder";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');
  vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);

  // Register commands
  Commands.registerCommands(context);

  // Load interface
  refresh(context);

  // Check changes file
  vscode.workspace.onDidSaveTextDocument(e => {
    var filename = e.fileName
      .replace(/\//g, "")
      .replace(/\\/g, "")
      .replace(
        (vscode.workspace.rootPath || "").replace(/\//g, "").replace(/\\/g, ""),
        ""
      );

    if (filename === "openapi.yaml") {
      DataService.refreshData();
      refresh(context);
      vscode.window.showInformationMessage("Refresh");
    }
  });
}

let refresh = function(context: vscode.ExtensionContext) {
  if (DataService.isSkaffolderProject()) {
    // Create trees
    const skaffolderProviderModel = new TreeProviderSkaffolder(
      context,
      "model"
    );
    // const skaffolderProviderApi = new TreeProviderSkaffolder(context, "api");
    const skaffolderProviderPage = new TreeProviderSkaffolder(context, "page");

    // Register trees
    vscode.window.registerTreeDataProvider(
      "skaffolderExplorerModel",
      skaffolderProviderModel
    );

    // vscode.window.registerTreeDataProvider(
    //   "skaffolderExplorerAPI",
    //   skaffolderProviderApi
    // );

    vscode.commands.executeCommand("setContext", "isSkaffolderProject", true);
    vscode.window.registerTreeDataProvider(
      "skaffolderExplorerPage",
      skaffolderProviderPage
    );
  } else {
    // Create trees
    const skaffolderProviderTemplate = new TreeProviderTemplateSkaffolder(
      context
    );

    // Register trees
    vscode.window.registerTreeDataProvider(
      "skaffolderExplorerTemplates",
      skaffolderProviderTemplate
    );

    // Set context
    vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);

    // vscode.window.showWarningMessage(
    //   "Workspace has no openapi.yaml, this is not a Skaffolder project"
    // );
  }
};

// this method is called when your extension is deactivated
export function deactivate() {}
