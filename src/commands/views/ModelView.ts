import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Resource } from "../../models/jsonreader/resource";

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
          case "save":
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
