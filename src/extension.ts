// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";
import * as SkaffolderCli from "skaffolder-cli";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Skaffolder" is now active!');
  let files: SkaffolderCli.GeneratorFile[] = SkaffolderCli.getGenFiles(
    vscode.workspace.rootPath + "/.skaffolder/template"
  );
  console.log("result", files);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "skaffolder.openmodel",
      async (
        confiFilePath: vscode.Uri,
        files: vscode.Uri[],
        rangeModel: vscode.Range
      ) => {
        // // open file source
        // await vscode.commands.executeCommand<vscode.Location[]>(
        //   "workbench.action.quickOpen",
        //   files
        // );

        // // Simulate ctrl + P
        // try {
        //   await vscode.commands.executeCommand<vscode.Location[]>(
        //     "workbench.action.quickOpen",
        //     "package.json"
        //   );
        // } catch (e) {
        //   console.error(e);
        // }

        // Open file
        try {
          // let contexturl = vscode.Uri.file(
          //   vscode.workspace.rootPath + "/openapi.yaml"
          // );

          await vscode.commands.executeCommand<vscode.Location[]>(
            "vscode.open",
            confiFilePath
          );
        } catch (e) {
          console.error(e);
        }

        // Select range
        // let pos: vscode.Position = new vscode.Position(3, 2);
        // let pos2: vscode.Position = new vscode.Position(8, 4);
        // let range: vscode.Range = new vscode.Range(pos, pos2);
        let selection: vscode.Selection = new vscode.Selection(
          rangeModel.start,
          rangeModel.end
        );
        vscode.window.visibleTextEditors[0].selection = selection;
        vscode.window.visibleTextEditors[0].revealRange(rangeModel);
      }
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "skaffolder.openapi",
      async (
        confiFilePath: vscode.Uri,
        files: vscode.Uri[],
        rangeModel: vscode.Range
      ) => {
        // Open file
        try {
          await vscode.commands.executeCommand<vscode.Location[]>(
            "vscode.open",
            confiFilePath
          );
        } catch (e) {
          console.error(e);
        }

        // Select range
        let selection: vscode.Selection = new vscode.Selection(
          rangeModel.start,
          rangeModel.end
        );
        vscode.window.visibleTextEditors[0].selection = selection;
        vscode.window.visibleTextEditors[0].revealRange(rangeModel);
      }
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "skaffolder.openpage",
      async (
        confiFilePath: vscode.Uri,
        files: vscode.Uri[],
        rangeModel: vscode.Range
      ) => {
        // Open file
        try {
          await vscode.commands.executeCommand<vscode.Location[]>(
            "vscode.open",
            confiFilePath
          );
        } catch (e) {
          console.error(e);
        }

        // Select range
        let selection: vscode.Selection = new vscode.Selection(
          rangeModel.start,
          rangeModel.end
        );
        vscode.window.visibleTextEditors[0].selection = selection;
        vscode.window.visibleTextEditors[0].revealRange(rangeModel);
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
