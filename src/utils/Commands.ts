import * as vscode from "vscode";
import * as path from "path";
import * as SkaffolderCli from "skaffolder-cli";
import { Resource } from "../models/jsonreader/resource";
import { Page } from "../models/jsonreader/page";
import { DataService } from "../services/DataService";
import { Db } from "../models/jsonreader/db";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { StatusBarManager } from "./StatusBarManager";
import * as fs from "fs";


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
          info: function (msg: string) {
            console.log(msg);
          }
        },
        StatusBarManager.refresh
      );
    });

    vscode.commands.registerCommand("skaffolder.export", data => {
      let params: any = DataService.readConfig();
      params.skObject = DataService.getYaml();
      DataService.exportProject(params, function (err: any, logs: any) {
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
            info: function (msg: string) {
              vscode.window.showInformationMessage(msg);
            }
          },
          async function (err: string[], logs: string[]) {
            vscode.window.showInformationMessage("Generation completed");

            // Print results in HTML
            const panel = vscode.window.createWebviewPanel(
              "skaffolder", // Identifies the type of the webview. Used internally
              "Skaffolder Generation Result", // Title of the panel displayed to the user
              vscode.ViewColumn.One, // Editor column to show the new webview panel in.
              {
                enableScripts: true
              }
            );

            const filePath: vscode.Uri = vscode.Uri.file(
              path.join(
                context.extensionPath,
                "src",
                "html",
                "reportGeneration.html"
              )
            );
            var html = fs.readFileSync(filePath.fsPath, "utf8");
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
          if (vscode.workspace.rootPath === undefined) {
            vscode.window.showInformationMessage("Please open a workspace!");
            return;
          }
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
                          info: function (msg: string) {
                            vscode.window.showInformationMessage(msg);
                          }
                        },
                        frontendObj,
                        backendObj,
                        skObj,
                        function (skObj) {
                          SkaffolderCli.init(
                            vscode.workspace.rootPath + "/",
                            skObj.project,
                            skObj.modules,
                            skObj.resource,
                            skObj.dbs
                          );
                          let content = fs.readFileSync(
                            (vscode.workspace.rootPath +
                              "/.skaffolder/template/openapi.yaml.hbs") as string,
                            "utf-8"
                          );
                          let file = SkaffolderCli.getProperties(
                            content,
                            "openapi.yaml.hbs",
                            "/.skaffolder/template/"
                          );
                          SkaffolderCli.generateFile(
                            [],
                            {
                              name: "openapi.yaml",
                              overwrite: file.overwrite,
                              template: file.template
                            },
                            skObj,
                            {}
                          );
                          vscode.window.showInformationMessage(
                            "Project create with openapi"
                          );
                        }
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
        async (contextNode: SkaffolderNode) => {
          const panel = vscode.window.createWebviewPanel(
            "skaffolder",
            "Skaffolder Edit",
            vscode.ViewColumn.One,
            {
              enableScripts: true
            }
          );
          try {
            // const filePath: vscode.Uri = vscode.Uri.file(
            //   path.join(context.extensionPath, "src", "html", "editModel.html")
            // );
            // panel.webview.html = fs.readFileSync(filePath.fsPath, "utf8");
            panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Security-Policy" content="default-src 'self' vscode-resource: https:;
                                            script-src vscode-resource: 'self' 'unsafe-inline' 'unsafe-eval' https:;
                                            style-src vscode-resource: 'self' 'unsafe-inline';
                                            img-src 'self' vscode-resource: data:" />
              <title>Edit Model</title>
            </head>
            <style>
              .logo {
                width: 50%;
                min-width: 300px;
                height: 50px;
              }
            </style>
            
            <body>
            <h1 id="lines-of-code-counter">0</h1>

            <button id="button">Save</button>
              ${ contextNode.skaffolderObject.dbs[0]._entity}
            </body>
            <script type="text/javascript">
              (function () {
              const counter = document.getElementById("lines-of-code-counter");
              const vscode = acquireVsCodeApi();
              console.log("ok");
              var save = function () {
                counter.textContent += 1;
                vscode.postMessage({
                  command: "save",
                  text: "test"
              });
            };
            document.getElementById("button").addEventListener("click", save);
            })();
</script>
            </html>`;

          } catch (e) {
            console.error(e);
          }
          //Handle messages from the webview
          panel.webview.onDidReceiveMessage(
            message => {
              console.log("ok");
              vscode.window.showInformationMessage("message");
              switch (message.command) {
                case "save":
                  vscode.window.showInformationMessage("Hello");
                  return;
              }
            },
            undefined,
            context.subscriptions
          );
        }
      )
    );
    

    // Edit model
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.editValue_yaml",
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

