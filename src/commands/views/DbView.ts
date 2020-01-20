import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";

export class DbView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "Sk Database - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Open yaml
    if (contextNode.params && contextNode.params.db) {
      await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", contextNode.params.db._id);
    }

    // Serve page
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }
    panel.webview.html = Webview.serve("editDb");

    // Message.Command editDb
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "openFiles":
            panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", contextNode);
            break;
          case "getDb":
            panel.webview.postMessage({
              command: "getDb",
              data: contextNode.params ? contextNode.params.db : null
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
