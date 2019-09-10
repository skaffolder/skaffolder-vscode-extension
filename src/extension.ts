// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";
import { DataService } from "./services/DataService";
import { Commands } from "./utils/Commands";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');
  // let files: SkaffolderCli.GeneratorFile[] = SkaffolderCli.getGenFiles(
  //   vscode.workspace.rootPath + "/.skaffolder/template"
  // );
  // console.log("result", files);

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

    vscode.window.registerTreeDataProvider(
      "skaffolderExplorerPage",
      skaffolderProviderPage
    );
  } else {
    vscode.window.showWarningMessage(
      "Workspace has no openapi.yaml, this is not a Skaffolder project"
    );
  }
};

// this method is called when your extension is deactivated
export function deactivate() {}
