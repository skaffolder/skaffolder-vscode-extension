import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class ApiView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    let nameRes = contextNode.params!.model!.name;
    const panel = vscode.window.createWebviewPanel(
      "skaffolder",
      "Sk API - " + nameRes + " " + contextNode.label,
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    panel.webview.html = Webview.serve("editApi");

    // Message.Command editApi
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "webview-ready":
            panel.webview.postMessage({
              command: "get-service",
              data: JSON.stringify({
                service: contextNode.params!.model!._services.find((item: any) => {
                  return item.name === contextNode.label;
                })
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
