import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";

import { Resource } from "../models/jsonreader/resource";
import { Page } from "../models/jsonreader/page";
import { DataService } from "../services/DataService";
import { Db } from "../models/jsonreader/db";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { StatusBarManager } from "./StatusBarManager";

export class Commands {
  static registerCommands(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("nodeDependencies.editEntry", node =>
      vscode.window.showInformationMessage(
        `Successfully called edit entry on ${node}.`
      )
    );

    // Register commands
    vscode.commands.registerCommand("skaffolder.login", data => {
      SkaffolderCli.login(
        {},
        {},
        {
          info: function(msg: string) {
            console.log(msg);
          }
        },
        StatusBarManager.refresh
      );
    });

    vscode.commands.registerCommand("skaffolder.export", data => {
      let params: any = DataService.readConfig();
      params.skObject = DataService.getSkObject();
      DataService.exportProject(params, function(err: any, logs: any) {
        console.log(err, logs);
      });
    });

    vscode.commands.registerCommand("skaffolder.generate", data => {
      vscode.window.showInformationMessage("Generation starts");
      try {
        SkaffolderCli.generate(
          vscode.workspace.rootPath + "/",
          DataService.getSkObject(),
          {
            info: function(msg: string) {
              vscode.window.showInformationMessage(msg);
            }
          },
          async function(err: string[], logs: string[]) {
            vscode.window.showInformationMessage("Generation completed");

            // Print results in HTML
            const panel = vscode.window.createWebviewPanel(
              "skaffolder", // Identifies the type of the webview. Used internally
              "Skaffolder Generation Result", // Title of the panel displayed to the user
              vscode.ViewColumn.One, // Editor column to show the new webview panel in.
              {} // Webview options. More on these later.
            );

            let html = "";
            html += `<style>
  
  logo {
    width: 50%;
    min-width: 300px;
  }
  
  h1 {}
  
  .file-result {
    margin-left: 15px;
  }
  
  .file-result.elaborated {
    margin-left: 0px;
  }

  .file-result.elaborated label{
    color: #dadada
  }
  .file-result.edit label{
    color: #0078CE
  }
  .file-result.created label{
    color: green
  }
  .file-result.error label{
    color: red
  }
  
  .file-result label {
    width: 100px;
    font-weight: bold;
    display: inline-block;
  }
  .file-result .file-name {
    display: inline-block;
  }
  </style>
  
  <img width="50%" class="logo" src="data:image/png;base64,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
  `;
            html += logs.join("\n");
            panel.webview.html = html;
          }
        );
      } catch (e) {
        console.error(e);
      }
    });

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
            .showInputBox({
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
                      vscode.window.showInformationMessage(
                        "Start creation project!"
                      );

                      let skObj = DataService.createSkObj(nameProj as string);

                      SkaffolderCli.createProjectExtension(
                        vscode.workspace.rootPath + "/",
                        "",
                        {
                          info: function(msg: string) {
                            vscode.window.showInformationMessage(msg);
                          }
                        },
                        frontendObj,
                        backendObj,
                        skObj
                      );
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
        "skaffolder.editValue",
        async (context: SkaffolderNode) => {
          if (context.params && context.params.range) {
            // Open file openapi

            let contexturl = vscode.Uri.file(
              vscode.workspace.rootPath + "/openapi.yaml"
            );

            try {
              await vscode.commands.executeCommand<vscode.Location[]>(
                "vscode.open",
                contexturl
              );
            } catch (e) {
              console.error(e);
            }

            // Select range
            let selection: vscode.Selection = new vscode.Selection(
              context.params.range.start,
              context.params.range.end
            );
            vscode.window.visibleTextEditors[0].selection = selection;
            vscode.window.visibleTextEditors[0].revealRange(
              context.params.range
            );
          } else {
            console.error("Type node not provided");
          }
        }
      )
    );

    // Open files
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openfiles",
        async (context: SkaffolderNode) => {
          // Open files
          try {
            if (context.params) {
              if (context.params.type === "resource") {
                let files = DataService.findRelatedFiles(
                  "resource",
                  context.params.model as Resource,
                  context.params.db as Db
                );
                this.openFiles(files);
              } else if (context.params.type === "module") {
                let files = DataService.findRelatedFiles("module", context
                  .params.page as Page);
                this.openFiles(files);
              } else if (context.params.type === "db") {
                let files = DataService.findRelatedFiles("db", context.params
                  .db as Db);
                this.openFiles(files);
              } else {
                console.error("Type " + context.params.type + " not valid");
              }
            } else {
              console.error("Type node not provided");
            }
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
