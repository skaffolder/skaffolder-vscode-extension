import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Resource } from "../../models/jsonreader/resource";
import { Entity } from "../../models/jsonreader/entity";

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
                "x-skaffolder-relations": (model._relations as any[]).reduce((acc, cur) => {
                  if (!acc) { acc = {}; }
                  acc[cur.name] = {
                    "x-skaffolder-id": cur._id,
                    "x-skaffolder-ent1": cur._ent1._id,
                    "x-skaffolder-ent2": cur._ent2._id,
                    "x-skaffolder-type": cur.type,
                  };

                  return acc;
                }, null),
                "properties": (_entity._attrs as any[]).reduce((acc, cur) => {
                  if (!acc) { acc = {}; }

                  let attr_type = cur.type || "String";
                  acc[cur.name] = {
                    "type": attr_type.toLowerCase(),
                    "x-skaffolder-id-attr": cur._id,
                    "x-skaffolder-type": attr_type,
                    "x-skaffolder-required": cur.required,
                  };

                  if (cur._enum) {
                    acc[cur.name]["x-skaffolder-enumeration"] = (cur._enum as any[]).map((val) => { return val.name; });
                  }

                  return acc;
                }, null)
              };

              Offline.createModel(model.name, yamlModel);
            }
            vscode.window.showInformationMessage("Save");
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
              data: contextNode.params ? contextNode.params.model : null
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
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
