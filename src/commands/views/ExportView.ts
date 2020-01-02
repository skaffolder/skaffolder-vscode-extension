import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { Webview } from "../../utils/WebView";

export class ExportView {
  static async open(logs: string[]) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Export", vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Serve page
    panel.webview.html = Webview.serve("export");

    // Message.Command editPage
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "getLogs":
            let html = logs.join("");

            panel.webview.postMessage({
              command: "getLogs",
              data: html
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
