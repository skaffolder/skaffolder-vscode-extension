import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Webview } from "../../utils/WebView";
import { Offline } from "skaffolder-cli";
import { Page } from "../../models/jsonreader/page";
import { Service } from "../../models/jsonreader/service";
import { refreshTree } from "../../extension";
import { DataService } from "../../services/DataService";
import { Db } from "../../models/jsonreader/db";

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
            // let html = "<div>" + logs.join("</div><div>") + "</div>";
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
