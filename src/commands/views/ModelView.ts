import * as vscode from "vscode";
import * as webviewExt from "../../test/webView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class ModelView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Model - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });
    panel.webview.html = new webviewExt.Webview().webView(EditNodeCommand.context.extensionPath, "editModel");
    console.log(contextNode.params!.model!._entity);

    // Message.Command editModel
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "webview-ready":
            panel.webview.postMessage({
              command: "get-data",
              data: JSON.stringify({
                skObject: contextNode.params,
                label: contextNode.label
              })
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
