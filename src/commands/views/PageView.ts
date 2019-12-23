import * as vscode from "vscode";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { Webview } from "../../utils/WebView";
import { Offline } from "skaffolder-cli";
import { Page } from "../../models/jsonreader/page";
import { Service } from "../../models/jsonreader/service";
import { refreshTree } from "../../extension";
import { DataService } from "../../services/DataService";

export class PageView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Page - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Open yaml
    if (contextNode.params) {
      await vscode.commands.executeCommand<vscode.Location[]>(
        "skaffolder.openpage",
        contextNode.params.contextUrl,
        contextNode.params.range,
        contextNode.params.page
      );
    }

    // Serve page
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }

    panel.webview.html = Webview.serve("editPage");

    // Message.Command editPage
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "savePage":
            if (message.data && message.data.page) {
              var page = message.data.page as Page;

              var yamlPage = {
                "x-skaffolder-id": page._id,
                "x-skaffolder-name": page.name,
                "x-skaffolder-url": page.url,
                "x-skaffolder-template": page.template,
                "x-skaffolder-resource": page._template_resource,
                "x-skaffolder-services": page._services
                  ? (page._services as Service[]).map(_serv => {
                      return _serv._id;
                    })
                  : page._services,
                "x-skaffolder-nesteds": page._nesteds
                  ? (page._nesteds as Page[]).map(_page => {
                      return _page._id;
                    })
                  : page._nesteds,
                "x-skaffolder-links": page._links
                  ? (page._links as Page[]).map(_page => {
                      return _page._id;
                    })
                  : page._links,
                "x-skaffolder-roles": page._roles
              };

              Offline.createPage(yamlPage);
            }

            // vscode.window.showInformationMessage("Saved");
            panel.webview.postMessage({
              command: "savePage",
              data: { result: "ok" }
            });

            refreshTree();

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
            case "addLinked":
              let linkList: any [] = DataService.getYaml().components["x-skaffolder-page"];
              let linkArray: string [] = linkList.map(linkItem => linkItem["x-skaffolder-links"]);
              let pageList: string [] = linkList.map(pageItem => pageItem["x-skaffolder-name"]);
              console.log(message.data);
              vscode.window.showQuickPick(pageList, {
                placeHolder: "Select linked page"
              }).then(link => {
                let linkItem: any = link;
                if(link) {
                  
                }
                panel.webview.postMessage({
                  command: "addLinked",
                  data: linkItem
                });
              });
              
                
              
              
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
