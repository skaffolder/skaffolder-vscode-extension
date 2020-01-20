import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Resource } from "../../models/jsonreader/resource";
import { Entity } from "../../models/jsonreader/entity";
import { refreshTree } from "../../extension";

export class ModelView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Model - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Open yaml
    if (contextNode.params) {
      await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", contextNode.params.range);
    }

    // Serve page
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }
    panel.webview.html = Webview.serve("editModel");

    // Message.Command editModel
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "saveModel":
            if (message.data) {
              var model = message.data as Resource;
              var _entity = model._entity as Entity;

              var yamlModel = {
                "x-skaffolder-id": model._id,
                "x-skaffolder-id-db": model._db,
                "x-skaffolder-id-entity": _entity._id,
                "x-skaffolder-url": model.url,
                "x-skaffolder-relations": (_entity._relations as any[]).reduce((acc, cur) => {
                  if (!acc) {
                    acc = {};
                  }
                  var _ent2 = cur._ent2._id || cur._ent2.name;

                  acc[cur.name] = {
                    "x-skaffolder-id": cur._id,
                    "x-skaffolder-ent1": _entity._id,
                    "x-skaffolder-ent2": _ent2,
                    "x-skaffolder-type": cur.type
                  };

                  if (cur.required) {
                    acc[cur.name]["x-skaffolder-required"] = true;
                  }

                  return acc;
                }, null),
                properties: (_entity._attrs as any[]).reduce((acc, cur) => {
                  if (!acc) {
                    acc = {};
                  }

                  let attr_type = cur.type || "String";
                  acc[cur.name] = {
                    type: attr_type.toLowerCase(),
                    "x-skaffolder-id-attr": cur._id,
                    "x-skaffolder-type": attr_type
                  };

                  if (cur.required) {
                    acc[cur.name]["x-skaffolder-required"] = true;
                  }

                  if (cur.unique) {
                    acc[cur.name]["x-skaffolder-unique"] = true;
                  }

                  if (cur._enum && cur._enum.length > 0) {
                    acc[cur.name]["x-skaffolder-enumeration"] = (cur._enum as any[]).map(val => {
                      return val.name;
                    });
                  }

                  return acc;
                }, null)
              };

              Offline.createModel(model.name, yamlModel);
            }
            vscode.window.showInformationMessage("Save");
            refreshTree();
            return;
          case "openFiles":
            panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", contextNode);
            break;
          case "getModel":
            panel.webview.postMessage({
              command: "getModel",
              data: {
                entity: contextNode.params ? contextNode.params.model : null,
                service: contextNode.params!.model!._services
              }
            });
            break;
          case "getAllModels":
            let listModels: Resource[] = [];
            if (contextNode.skaffolderObject.resources && contextNode.skaffolderObject.resources.length === 1) {
              listModels = contextNode.skaffolderObject.resources[0]._resources;
            } else if (contextNode.skaffolderObject.resources) {
              contextNode.skaffolderObject.resources.forEach(db => {
                if (contextNode.params && contextNode.params.db && db._id === contextNode.params.db._id) {
                  listModels = db._resources;
                }
              });
            }

            panel.webview.postMessage({
              command: "getAllModels",
              data: listModels
            });
            break;
          case "addApi":
            panel.webview.postMessage({
              command: "addApi"
            });

            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.createApi", contextNode);
            break;
          case "removeModel":
            if (message.data) {
              vscode.window.showWarningMessage(`Are you sure you want to delete "${message.data.name}" model?`, "Yes", "No").then((removeModel) => {

                if (removeModel && removeModel === "Yes") {
                  vscode.window.showWarningMessage(`Do you want to delete "${message.data.name}" model template pages too?`, "Yes", "No").then((removePages) => {

                    if (removePages) {
                      if (Offline.removeModel(message.data._id, removePages === "Yes")) {
                        panel.dispose();
                      }

                      refreshTree();
                    }
                  });
                }
              });
            }
            break;
          case "createCrud":
            if (message.data) {
              let resource = message.data as Resource;
              let _entity = resource._entity as Entity;

              if (_entity) {
                var model_yaml = {
                  "x-skaffolder-id": resource._id,
                  "x-skaffolder-id-entity": _entity._id
                } as any;

                if (resource._relations && resource._relations.length > 0) {
                  model_yaml["x-skaffolder-relations"] = (resource._relations as any[]).reduce((acc, cur) => {
                    if (!acc) {
                      acc = {};
                    }
                    var _ent2 = cur._ent2._id || cur._ent2.name;

                    acc[cur.name] = {
                      "x-skaffolder-id": cur._id,
                      "x-skaffolder-ent1": _entity._id,
                      "x-skaffolder-ent2": _ent2,
                      "x-skaffolder-type": cur.type
                    };

                    if (cur.required) {
                      acc[cur.name]["x-skaffolder-required"] = true;
                    }

                    return acc;
                  }, null);
                }

                Offline.createCrud(model_yaml);
              }
            }
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
