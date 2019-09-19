import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";

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
    
    // Create project
    try {
      // Get list templates
      SkaffolderCli.getTemplate((err: any, template: any[]) => {
        vscode.commands.registerCommand("skaffolder.createProject", node => {
          let listFrontend: any[] = [];
          let listBackend: any[] = [];

          template.filter(temp => {
            if (temp.type === "frontend") {
              listFrontend.push({
                label: temp.name,
                context: temp._id
              });
            } else if (temp.type === "backend") {
              listBackend.push({
                label: temp.name,
                context: temp._id
              });
            }
          });

          // Ask name
          vscode.window
            .showInputBox( {
              placeHolder: "Insert the name of your project"
            })
            .then(nameProj => {
              console.log(nameProj);
          // Ask backend
          vscode.window
            .showQuickPick(listFrontend, {
              placeHolder: "Choose your frontend language"
            })
            .then(frontendObj => {
              vscode.window
                .showQuickPick(listBackend, {
                  placeHolder: "Choose your backend language"
                })
                .then(async backendObj => {
                  SkaffolderCli.createProjectExtension(nameProj, frontendObj, backendObj);
                });
            });
        });
         });
      });
    } catch (e) {
      console.error(e);
    }

    // Edit model
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.editmodel",
        async (confiFilePath: vscode.Uri, rangeModel: vscode.Range) => {
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
        }
      )
    );

    // Open files
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openfiles",
        async (model: Resource, db: Db) => {
          // Open files
          try {
            let files = DataService.findRelatedFiles("resource", model, db);
            this.openFiles(files);
          } catch (e) {
            console.error(e);
          }
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
          model: Resource,
          db: Db
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
          let files = DataService.findRelatedFiles("resource", model, db);

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
          let files = DataService.findRelatedFiles("module", page);

          this.openFiles(files);
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
