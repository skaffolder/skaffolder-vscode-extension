import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Webview } from "../../utils/WebView";

export class ModuleView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Page - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    panel.webview.html = Webview.serve("editPage");

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
      EditNodeCommand.context.subscriptions
    );
  }
}
