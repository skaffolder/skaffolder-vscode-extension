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

export class PageView {
  static async open(contextNode: SkaffolderNode) {
    // Init panel
    const panel = vscode.window.createWebviewPanel("skaffolder", "SK Page - " + contextNode.label, vscode.ViewColumn.One, {
      enableScripts: true
    });

    // Open yaml
    if (contextNode.params) {
      await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", contextNode.params.range);
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

            break;

          case "openFiles":
            panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", contextNode);
            break;

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
            let pageList: any[] = DataService.getYaml().components["x-skaffolder-page"];
            let pageNameList: string[] = pageList.map(pageItem => pageItem["x-skaffolder-name"]);
            if (message.data === null) {
              message.data = [];
            }
            let pageNameListPresent: string[] = message.data.map((pagePresent: any) => pagePresent["name"]);
            pageNameList = pageNameList.filter(item => {
              return pageNameListPresent.indexOf(item) === -1 && item !== contextNode.params!.page!.name;
            });

            vscode.window
              .showQuickPick(pageNameList, {
                placeHolder: "Select linked page"
              })
              .then(link => {
                let linkItem: any = link;
                if (link) {
                  pageList.filter(item => {
                    if (item["x-skaffolder-name"] === link) {
                      linkItem = { name: item["x-skaffolder-name"], _id: item["x-skaffolder-id"] };
                    }
                  });
                }
                panel.webview.postMessage({
                  command: "addLinked",
                  data: linkItem
                });
              });
            break;

          case "addNested":
            let pageLists: any[] = DataService.getYaml().components["x-skaffolder-page"];
            let pageNameLists: string[] = pageLists.map(pageItem => pageItem["x-skaffolder-name"]);
            if (message.data === null) {
              message.data = [];
            }
            let pageNameListPresents: string[] = message.data.map((pagePresent: any) => pagePresent["name"]);
            pageNameLists = pageNameLists.filter(item => {
              return pageNameListPresents.indexOf(item) === -1 && item !== contextNode.params!.page!.name;
            });

            vscode.window.showQuickPick(pageNameLists, {
              placeHolder: "Select nested page"
            })
              .then(nested => {
                let nestedItem: any = nested;
                if (nested) {
                  pageLists.filter(item => {
                    if (item["x-skaffolder-name"] === nested) {
                      nestedItem = { name: item["x-skaffolder-name"], _id: item["x-skaffolder-id"] };
                    }
                  });
                }
                panel.webview.postMessage({
                  command: "addNested",
                  data: nestedItem
                });
              });
            break;

          case "addTemplate":
            let template = ["List", "Edit"];
            let templateResource: any[] = [];
            contextNode.skaffolderObject.resources.forEach(db => {
              templateResource = templateResource.concat(db._resources);
            });
            templateResource = templateResource.map(templateItem => {
              return {
                label: templateItem["name"],
                value: templateItem._id
              };
            });
            vscode.window.showQuickPick(template, {
              placeHolder: "Select template"
            }).then(template => {
              vscode.window.showQuickPick(templateResource, {
                placeHolder: "Select resource",
                matchOnDescription: false
              }).then(result => {
                result.type = template;
                panel.webview.postMessage({
                  command: "addTemplate",
                  data: result
                });
              });
            });
          case "getResourceName":
            for (let i in contextNode.skaffolderObject.resources) {
              let db: Db = contextNode.skaffolderObject.resources[i];
              for (let index in db._resources) {
                let resource = db._resources[index];
                if (resource._id === message.data) {
                  panel.webview.postMessage({
                    command: "getResourceName",
                    data: resource.name
                  });
                  return;
                }
              }
            }
            break;    
            case "addApi":
              let entity: any[] = [];
              let serviceList: any [] = [];
              contextNode.skaffolderObject.resources.forEach(db => {
                entity = entity.concat(db._resources);
              });
              entity.forEach(api => {
                serviceList = serviceList.concat(api._services);
              });

              serviceList = serviceList.map(serviceItem => {  
                return {
                  label: serviceItem["name"],
                  id: serviceItem["_id"],
                  nameResource: serviceItem._resource.name,
                  url: serviceItem["url"],
                  method: serviceItem["method"]
                };
              });
              entity = entity.map(entityItem => {
                return {
                  label: entityItem["name"],
                  value: entityItem._id,
                };
              });
              if(message.data === null) {
                message.data = [];
              }
              let serviceListPresent: string [] = message.data.map((servicePresent: any) => servicePresent["_id"]);
              serviceList = serviceList.filter(item => {
                return serviceListPresent.indexOf(item["id"]) === -1;
              });

              vscode.window.showQuickPick(entity, {
                placeHolder: "Select entity"
              }).then(api => {
                let apiItem: any[] = [];
                if(apiItem) {
                  apiItem = serviceList.filter(item => {
                    if(item.nameResource === api.label) {
                      return {
                        label: item.label + " " + item.url,
                        id_service: item.id,
                        nameResource: item.nameResource,
                        method: item.method,
                        name: item.label
                      };
                    }
                  });
                  vscode.window.showQuickPick(apiItem, {
                    placeHolder:"Select api"
                  }).then(result => {
                    panel.webview.postMessage({
                      command: "addApi",
                      data: result
                    });
                  });
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
