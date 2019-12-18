import * as vscode from "vscode";
import * as webviewExt from "../../test/webView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class DbView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "Sk Database - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });
    panel.webview.html = new webviewExt.Webview().webView(EditNodeCommand.context.extensionPath, "editDb");

    // Message.Command editDb
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "webview-ready":
            panel.webview.postMessage({
              command: "get-db",
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
