import * as SkaffolderCli from "skaffolder-cli";
import * as vscode from "vscode";
import * as webviewExt from "../../test/webView";
import { EditValueCommand } from "../EditValueCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class DbView {
  static async open(contextNode: SkaffolderNode, panel: vscode.WebviewPanel) {
    panel.webview.html = new webviewExt.Webview().webView(EditValueCommand.context.extensionPath, "editDb");

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
      EditValueCommand.context.subscriptions
    );
  }
}
