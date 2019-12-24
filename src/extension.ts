// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";
import { DataService } from "./services/DataService";
import { Commands } from "./utils/Commands";
import { TreeProviderTemplateSkaffolder } from "./providers/treeProviderTemplateSkaffolder";
import SkaffolderCli = require("skaffolder-cli");
import { StatusBarManager } from "./utils/StatusBarManager";

let contextExtension: vscode.ExtensionContext;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');
  vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);
  contextExtension = context;

  // Register commands
  Commands.registerCommands(contextExtension);

  // Load status bar
  StatusBarManager.init();

  // Check changes file
  vscode.workspace.onDidSaveTextDocument(e => {
    var filename = e.fileName
      .replace(/\//g, "")
      .replace(/\\/g, "")
      .replace((vscode.workspace.rootPath || "").replace(/\//g, "").replace(/\\/g, ""), "");

    if (filename === "openapi.yaml") {
      refreshTree();
    }
  });

  // Load interface
  try {
    refresh();
  } catch (e) {}
}

export function refreshTree() {
  DataService.refreshData();
  // Load interface
  vscode.window.showInformationMessage("Refresh");
  return refresh();
}

let refresh = function() {
  if (DataService.isSkaffolderProject()) {
    // Create trees
    const skaffolderProviderModel = new TreeProviderSkaffolder(contextExtension, "model");
    // const skaffolderProviderApi = new TreeProviderSkaffolder(context, "api");
    const skaffolderProviderPage = new TreeProviderSkaffolder(contextExtension, "page");

    // Register trees
    vscode.window.registerTreeDataProvider("skaffolderExplorerModel", skaffolderProviderModel);

    vscode.commands.executeCommand("setContext", "isSkaffolderProject", true);
    vscode.window.registerTreeDataProvider("skaffolderExplorerPage", skaffolderProviderPage);

    return {
      model: skaffolderProviderModel,
      page: skaffolderProviderPage
    };
  } else {
    // Create trees
    const skaffolderProviderTemplate = new TreeProviderTemplateSkaffolder(contextExtension);

    // Register trees
    vscode.window.registerTreeDataProvider("skaffolderExplorerTemplates", skaffolderProviderTemplate);

    // Set context
    vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);

    // vscode.window.showWarningMessage(
    //   "Workspace has no openapi.yaml, this is not a Skaffolder project"
    // );
  }
};

// this method is called when your extension is deactivated
export function deactivate() {}
