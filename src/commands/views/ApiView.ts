import * as SkaffolderCli from "skaffolder-cli";
import * as vscode from "vscode";
import * as webviewExt from "../../test/webView";
import { EditValueCommand } from "../EditValueCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class ApiView {
  static async open(contextNode: SkaffolderNode, panel: vscode.WebviewPanel) {
    panel.webview.html = new webviewExt.Webview().webView(EditValueCommand.context.extensionPath, "editApi");

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
      EditValueCommand.context.subscriptions
    );
  }
}
