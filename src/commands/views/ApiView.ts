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
          case "saveApi":
            if (message.data && message.data._resource) {
              var service = message.data as Service; 
              var _res = DataService.findResource(service._resource as string);

              if (_res) {
                var service_yaml = {
                  "x-skaffolder-id": service._id,
                  "x-skaffolder-name": service.name,
                  "x-skaffolder-id-resource": _res._id,
                  "x-skaffolder-resource": _res.name,
                  "x-skaffolder-crudAction": service.crudAction,
                  "x-skaffolder-crudType": service.crudType,
                  "x-skaffolder-description": service.description,
                  "x-skaffolder-returnDesc": service.returnDesc,
                  "x-skaffolder-returnType": service.returnType,
                  "x-skaffolder-url": service.url,
                  "parameters": service._params.map((val) => {
                    return {
                      "name": val.name,
                      "x-skaffolder-type": val.type,
                      "in": "path",
                      "description": val.description,
                      "required": true
                    };
                  })
                } as any;

                if (service._roles) {
                  service_yaml["x-skaffolder-roles"] = service._roles.map((val) => { return val._id; });
                }

                Offline.createService(service_yaml, service.method, _res);
              }
            }
            vscode.window.showInformationMessage("Save");
            return;
          case "openFiles":
            panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", contextNode);
            break;
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
