import * as vscode from "vscode";
import { Resource } from "../models/jsonreader/resource";
import { Page } from "../models/jsonreader/page";
import { DataService } from "../services/DataService";
import { Db } from "../models/jsonreader/db";

export class Commands {
  static registerCommands(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("nodeDependencies.editEntry", node =>
      vscode.window.showInformationMessage(
        `Successfully called edit entry on ${node}.`
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openmodel",
        async (
          confiFilePath: vscode.Uri,
          rangeModel: vscode.Range,
          model: Resource,
          db: Db
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

          // Open file openapi
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

          // Open files
          let files = DataService.findRelatedFiles("resource", model, db);

          this.openFiles(files);
        }
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openapi",
        async (
          confiFilePath: vscode.Uri,
          rangeModel: vscode.Range,
          files: string[]
        ) => {
          // Open file openapi
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

          // Open files
          this.openFiles(files);
        }
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openpage",
        async (
          confiFilePath: vscode.Uri,
          rangeModel: vscode.Range,
          page: Page
        ) => {
          // Open file openapi
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

          // Open files
          // this.openFiles(files);
        }
      )
    );
  }
  static openFiles(files: string[]) {
    // Open files
    vscode.window.showQuickPick(files).then(async item => {
      if (item) {
        let uri = vscode.Uri.file(vscode.workspace.rootPath + "/" + item);
        await vscode.commands.executeCommand<vscode.Location[]>(
          "vscode.open",
          uri
        );
      }
    });
  }
}
