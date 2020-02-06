import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Resource } from "../../models/jsonreader/resource";
import { Entity } from "../../models/jsonreader/entity";
import { refreshTree } from "../../extension";
import { SkaffolderView } from "./SkaffolderView";

export class ModelView extends SkaffolderView {
  static async open(contextNode: SkaffolderNode) {
    if (!ModelView.instance) {
      ModelView.instance = new ModelView(contextNode);
    } else {
      ModelView.instance.contextNode = contextNode;
    }

    await ModelView.instance.updatePanel();
  }

  public registerOnDisposePanel() {
    this.panel.onDidDispose((e) => {
      ModelView.instance = undefined;
    });
  }

  public getTitle(): string {
    return `SK Model - ${this.contextNode.label}`;
  }

  public getYamlID(): string | undefined {
    if (this.contextNode.params && this.contextNode.params.model) {
      return this.contextNode.params.model._id;
    }
  }

  public registerPanelListeners(): void {
    this.panel.webview.html = Webview.serve("editModel");

    // Message.Command editModel
    this.panel.webview.onDidReceiveMessage(
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
                "x-skaffolder-relations": (_entity._relations as any[])
                  .filter(val => {
                    return val._ent2._id !== _entity._id;
                  })
                  .reduce((acc, cur) => {
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

                  if (!cur.name) {
                    return acc;
                  }

                  let attr_type;
                  switch (cur.type) {
                    case "Date":
                    case "Integer":
                      attr_type = "integer";
                      break;
                    case "Decimal":
                    case "Number":
                      attr_type = "number";
                      break;
                    case "ObjectId":
                    case "String":
                      attr_type = "string";
                      break;
                    case "Boolean":
                      attr_type = "boolean";
                      break;
                    case "Custom":
                      attr_type = "object";
                      break;
                    default:
                      attr_type = "string";
                      cur.type = "String";
                  }

                  acc[cur.name] = {
                    type: attr_type,
                    "x-skaffolder-id-attr": cur._id,
                    "x-skaffolder-type": cur.type
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
            this.panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", this.contextNode);
            break;
          case "getModel":
            this.panel.webview.postMessage({
              command: "getModel",
              data: {
                entity: this.contextNode.params ? this.contextNode.params.model : null,
                service: this.contextNode.params!.model!._services
              }
            });
            break;
          case "getAllModels":
            let listModels: Resource[] = [];
            if (this.contextNode.skaffolderObject.resources && this.contextNode.skaffolderObject.resources.length === 1) {
              listModels = this.contextNode.skaffolderObject.resources[0]._resources;
            } else if (this.contextNode.skaffolderObject.resources) {
              this.contextNode.skaffolderObject.resources.forEach(db => {
                if (this.contextNode.params && this.contextNode.params.db && db._id === this.contextNode.params.db._id) {
                  listModels = db._resources;
                }
              });
            }

            this.panel.webview.postMessage({
              command: "getAllModels",
              data: listModels
            });
            break;
          case "addApi":
            this.panel.webview.postMessage({
              command: "addApi"
            });

            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.createApi", this.contextNode);
            break;
          case "removeModel":
            if (message.data) {
              vscode.window
                .showWarningMessage(`Are you sure you want to delete "${message.data.name}" model?`, "Yes", "No")
                .then(removeModel => {
                  if (removeModel && removeModel === "Yes") {
                    vscode.window
                      .showWarningMessage(`Do you want to delete "${message.data.name}" model template pages too?`, "Yes", "No")
                      .then(removePages => {
                        if (removePages) {
                          if (Offline.removeModel(message.data._id, removePages === "Yes")) {
                            this.panel.dispose();
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
                  model_yaml["x-skaffolder-relations"] = (resource._relations as any[])
                    .reduce((acc, cur) => {
                      if (!acc) {
                        acc = {};
                      }

                      acc[cur.name] = {
                        "x-skaffolder-id": cur._id,
                        "x-skaffolder-ent1": cur._ent1._id || cur._ent1.name,
                        "x-skaffolder-ent2": cur._ent2._id || cur._ent2.name,
                        "x-skaffolder-type": cur.type
                      };

                      if (cur.required) {
                        acc[cur.name]["x-skaffolder-required"] = true;
                      }

                      return acc;
                    }, null);
                }

                Offline.createCrud(model_yaml);
                refreshTree();
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
