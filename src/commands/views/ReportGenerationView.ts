import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { Webview } from "../../utils/WebView";
import { refreshTree } from "../../extension";

export class ReportGenerationView {
  async open() {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "Skaffolder Generation Result", vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Serve page
    panel.webview.html = Webview.serve("reportGeneration");

    // Message.Command getLogs
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "getLogs":
            this.htmlLogProm.then(logs => {
              panel.webview.postMessage({
                command: "getLogs",
                data: logs
              });
            });
            return;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }

  // Log prom
  sendLogs(html: string) {
    if (this.resolvehtml) {
      this.resolvehtml(html);
    }
  }

  resolvehtml: ((value?: string | PromiseLike<string> | undefined) => void) | undefined;
  htmlLogProm: Promise<string> = new Promise<string>((resolve, reject) => {
    this.resolvehtml = resolve;
  });
}
