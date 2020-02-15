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
import { SkaffolderView } from "./SkaffolderView";

export class PageView extends SkaffolderView {
  static async open(contextNode: SkaffolderNode) {
    if (!PageView.instance) {
      PageView.instance = new PageView(contextNode);
    } else {
      PageView.instance.contextNode = contextNode;
    }

    await PageView.instance.updatePanel();
  }

  public registerOnDisposePanel() {
    this.panel.onDidDispose((e) => {
      PageView.instance = undefined;
    });
  }

  public getTitle(): string {
    return `SK Page - ${this.contextNode.label}`;
  }

  public getYamlID(): string | undefined {
    if (this.contextNode.params && this.contextNode.params.page) {
      return this.contextNode.params.page._id;
    }
  }

  public registerPanelListeners(): void {
    this.panel.webview.html = Webview.serve("editPage");

    // Message.Command editPage
    this.panel.webview.onDidReceiveMessage(
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
                "x-skaffolder-roles": page._roles
              } as any;

              if (page._services && page._services.length > 0) {
                yamlPage["x-skaffolder-services"] = (page._services as Service[]).map(_serv => {
                  return _serv._id;
                });
              }

              if (page._nesteds && page._nesteds.length > 0) {
                yamlPage["x-skaffolder-nesteds"] = (page._nesteds as Page[]).map(_serv => {
                  return _serv._id;
                });
              }

              if (page._links && page._links.length > 0) {
                yamlPage["x-skaffolder-links"] = (page._links as Page[]).map(_serv => {
                  return _serv._id;
                });
              }

              Offline.createPage(yamlPage);
            }

            // vscode.window.showInformationMessage("Saved");
            this.panel.webview.postMessage({
              command: "savePage",
              data: { result: "ok" }
            });

            refreshTree();

            break;

          case "openFiles":
            this.panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", this.contextNode);
            break;

          case "getPage":
            this.panel.webview.postMessage({
              command: "getPage",
              data: {
                page: this.contextNode.params!.page!,
                label: this.contextNode.label,
                api: this.contextNode.skaffolderObject.modules
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

          case "addLinked":
            let pageList: any[] = DataService.getYaml().components["x-skaffolder-page"];
            let pageNameList: string[] = pageList.map(pageItem => pageItem["x-skaffolder-name"]);
            if (message.data === null) {
              message.data = [];
            }
            let pageNameListPresent: string[] = message.data.map((pagePresent: any) => pagePresent["name"]);
            pageNameList = pageNameList.filter(item => {
              return pageNameListPresent.indexOf(item) === -1 && item !== this.contextNode.params!.page!.name;
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
                this.panel.webview.postMessage({
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
              return pageNameListPresents.indexOf(item) === -1 && item !== this.contextNode.params!.page!.name;
            });

            vscode.window
              .showQuickPick(pageNameLists, {
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
                this.panel.webview.postMessage({
                  command: "addNested",
                  data: nestedItem
                });
              });
            break;

          case "addTemplate":
            let template = ["List", "Edit"];
            let templateResource: any[] = [];
            this.contextNode.skaffolderObject.resources.forEach(db => {
              templateResource = templateResource.concat(db._resources);
            });
            templateResource = templateResource.map(templateItem => {
              return {
                label: templateItem["name"],
                value: templateItem._id
              };
            });
            vscode.window
              .showQuickPick(template, {
                placeHolder: "Select template"
              })
              .then(template => {
                vscode.window
                  .showQuickPick(templateResource, {
                    placeHolder: "Select resource",
                    matchOnDescription: false
                  })
                  .then(result => {
                    result.type = template;
                    this.panel.webview.postMessage({
                      command: "addTemplate",
                      data: result
                    });
                  });
              });
          case "getResourceName":
            for (let i in this.contextNode.skaffolderObject.resources) {
              let db: Db = this.contextNode.skaffolderObject.resources[i];
              for (let index in db._resources) {
                let resource = db._resources[index];
                if (resource._id === message.data) {
                  this.panel.webview.postMessage({
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
            let serviceList: any[] = [];
            this.contextNode.skaffolderObject.resources.forEach(db => {
              entity = entity.concat(db._resources);
            });
            entity.forEach(api => {
              serviceList = serviceList.concat(api._services);
            });

            serviceList = serviceList.map(serviceItem => {
              return {
                label: serviceItem["name"],
                id: serviceItem["_id"],
                _resource: serviceItem._resource,
                url: serviceItem["url"],
                method: serviceItem["method"]
              };
            });
            entity = entity.map(entityItem => {
              return {
                label: entityItem["name"],
                value: entityItem._id
              };
            });
            if (message.data === null) {
              message.data = [];
            }
            let serviceListPresent: string[] = message.data.map((servicePresent: any) => servicePresent["_id"]);
            serviceList = serviceList.filter(item => {
              return serviceListPresent.indexOf(item["id"]) === -1;
            });

            vscode.window
              .showQuickPick(entity, {
                placeHolder: "Select entity"
              })
              .then(api => {
                let apiItem: any[] = [];
                if (apiItem) {
                  apiItem = serviceList.filter(item => {
                    return item._resource === api.value;
                  });
                  vscode.window
                    .showQuickPick(apiItem, {
                      placeHolder: "Select api"
                    })
                    .then(result => {
                      result.nameResource = api.label;
                      this.panel.webview.postMessage({
                        command: "addApi",
                        data: result
                      });
                    });
                }
              });
            break;
          case "removePage":
            if (message.data) {
              vscode.window.showWarningMessage(`Are you sure you want to delete "${message.data.name}" page?`, { modal: true }, { title: "Remove" }).then((val) => {
                if (val && val.title === "Remove") {
                  Offline.removePage(message.data._id);
                  this.panel.dispose();
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
