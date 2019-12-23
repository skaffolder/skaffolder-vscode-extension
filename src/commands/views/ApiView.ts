import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Service } from "../../models/jsonreader/service";

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

    // Open yaml
    if (contextNode.params) {
      await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", contextNode.params.range);
    }

    // Serve page
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }
    panel.webview.html = Webview.serve("editApi");

    // Message.Command editApi
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "getApi":
            console.log(contextNode.params ? contextNode.params.service : null);
            panel.webview.postMessage({
              command: "getApi",
              data: contextNode.params ? contextNode.params.service : null
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
