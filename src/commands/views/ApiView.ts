import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Service } from "../../models/jsonreader/service";
import { DataService } from "../../services/DataService";

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
            panel.webview.postMessage({
              command: "getApi",
              data: contextNode.params ? contextNode.params.service : null
            });
            break;

          case "chooseRole":
            let roleList: any[] = DataService.getYaml().components["x-skaffolder-roles"];
            let roleArray: string[] = roleList.map(roleItem => roleItem["x-skaffolder-name"]);
            if (message.data === undefined) {
              // public
              roleArray.unshift("* PRIVATE");
            } else {
              // private o roles
              roleArray.unshift("* PUBLIC");

              // remove selected
              let oldRoleObj: any[] = message.data;
              let oldRole: string[] = oldRoleObj.map(item => item.name);
              roleArray = roleArray.filter(role => oldRole.indexOf(role) === -1);
            }
            vscode.window
              .showQuickPick(roleArray, {
                placeHolder: "Select a role"
              })
              .then(role => {
                let roleItem: any = role;
                if (role) {
                  roleList.filter(item => {
                    if (item["x-skaffolder-name"] === role) {
                      roleItem = { name: item["x-skaffolder-name"], _id: item["x-skaffolder-id"] };
                    }
                  });
                }

                panel.webview.postMessage({
                  command: "chooseRole",
                  data: roleItem
                });
              });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
