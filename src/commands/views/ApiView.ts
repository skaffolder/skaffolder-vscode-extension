import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Offline } from "skaffolder-cli";
import { Service } from "../../models/jsonreader/service";
import { DataService } from "../../services/DataService";
import { refreshTree } from "../../extension";
import { SkaffolderView } from "./SkaffolderView";

export class ApiView extends SkaffolderView {
  static async open(contextNode: SkaffolderNode) {
    if (!ApiView.instance) {
      ApiView.instance = new ApiView(contextNode);
    } else {
      ApiView.instance.contextNode = contextNode;
    }

    await ApiView.instance.updatePanel();
  }

  public registerOnDisposePanel() {
    this.panel.onDidDispose(e => {
      ApiView.instance = undefined;
    });
  }

  public getTitle(): string {
    let resName = "";

    if (this.contextNode.params && this.contextNode.params.model) {
      resName = this.contextNode.params.model.name;
    }

    return `SK API - ${resName} ${this.contextNode.label}`;
  }

  public getYamlID(): string | undefined {
    if (this.contextNode.params && this.contextNode.params.service) {
      return this.contextNode.params.service._id;
    }
  }

  public registerPanelListeners(): void {
    this.panel.webview.html = Webview.serve("editApi");

    // Message.Command editApi
    this.panel.webview.onDidReceiveMessage(
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
                  parameters: service._params.map(val => {
                    return {
                      name: val.name,
                      "x-skaffolder-type": val.type,
                      in: "path",
                      description: val.description,
                      required: true
                    };
                  })
                } as any;

                if (service._roles) {
                  service_yaml["x-skaffolder-roles"] = service._roles.map(val => {
                    return val._id;
                  });
                }

                Offline.createService(service_yaml, service.method, _res);
              }
            }
            vscode.window.showInformationMessage("Save");
            return;
          case "openFiles":
            this.panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", this.contextNode);
            break;
          case "getApi":
            this.panel.webview.postMessage({
              command: "getApi",
              data: {
                api: this.contextNode.params ? this.contextNode.params.service : null,
                model: this.contextNode.params ? this.contextNode.params.model : null
              }
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

                this.panel.webview.postMessage({
                  command: "chooseRole",
                  data: roleItem
                });
              });
            break;

          case "removeApi":
            if (message.data) {
              vscode.window
                .showWarningMessage(
                  `Are you sure you want to delete "${message.data.name}" API?`,
                  { modal: true },
                  { title: "Remove" }
                )
                .then(val => {
                  if (val && val.title === "Remove") {
                    if (Offline.removeService(message.data._id)) {
                      this.panel.dispose();
                    }

                    refreshTree();
                  }
                });
            }
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
