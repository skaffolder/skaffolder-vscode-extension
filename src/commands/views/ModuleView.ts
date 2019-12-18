import * as SkaffolderCli from "skaffolder-cli";
import * as vscode from "vscode";
import * as webviewExt from "../../test/webView";
import { EditValueCommand } from "../EditValueCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";

export class ModuleView {
  static async open(contextNode: SkaffolderNode, panel: vscode.WebviewPanel) {
    panel.webview.html = new webviewExt.Webview().webView(EditValueCommand.context.extensionPath, "editPage");

    // Message.Command editPage
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "webview-ready":
            panel.webview.postMessage({
              command: "get-page",
              data: JSON.stringify({
                page: contextNode.params!.page!,
                label: contextNode.label,
                api: contextNode.skaffolderObject.modules
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
