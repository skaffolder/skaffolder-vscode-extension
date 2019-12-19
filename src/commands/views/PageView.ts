import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Webview } from "../../utils/WebView";

export class PageView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Page - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    panel.webview.html = Webview.serve("editPage");

    // Message.Command editPage
    panel.webview.onDidReceiveMessage(
      message => {
        console.log("server received");
        switch (message.command) {
          case "savePage":
            console.log("server msg");
            vscode.window.showInformationMessage("Save");
            panel.webview.postMessage({
              command: "savePage",
              data: { result: "ok" }
            });
            return;
          case "getPage":
            panel.webview.postMessage({
              command: "getPage",
              data: {
                page: contextNode.params!.page!,
                label: contextNode.label,
                api: contextNode.skaffolderObject.modules
              }
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
