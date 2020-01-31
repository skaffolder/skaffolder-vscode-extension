import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { ApiView } from "./views/ApiView";
import { Resource } from "../models/jsonreader/resource";

export class CreateApiCommand {
  static async command(contextNode: SkaffolderNode) {
    if (vscode.workspace.rootPath === undefined) {
      vscode.window.showInformationMessage("Please open a workspace!");
      return;
    }

    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }

    let askApi = (modelItem: any | undefined) => {
      if (modelItem) {
        vscode.window
          .showInputBox({
            placeHolder: "Insert the name of your API"
          })
          .then(nameApi => {
            if (nameApi) {

              // Ask URL
              vscode.window
                .showInputBox({
                  prompt: "Insert the url of your API",
                  placeHolder: "the url of your API",
                  value: "/"
                }).then(urlApi => {
                  if (urlApi) {
                    let listMethod = ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTION"];
                    var _res = (modelItem._res || modelItem) as Resource;

                    _res._services.forEach((_service) => {
                      if (_service.url === urlApi) {
                        var indexMethod = listMethod.indexOf(_service.method);

                        if (indexMethod !== -1) {
                          listMethod.splice(indexMethod, 1);
                        }
                      }
                    });

                    if (listMethod.length !== 0) {
                      // ask method
                      vscode.window
                        .showQuickPick(listMethod, {
                          placeHolder: "Choose the API method"
                        }).then(methodApi => {
                          if (methodApi) {

                            // create api
                            if (_res) {
                              var api_yaml = {
                                "x-skaffolder-name": nameApi,
                                "x-skaffolder-id-resource": _res._id,
                                "x-skaffolder-resource": _res.name,
                                "x-skaffolder-url": urlApi,
                                "x-skaffolder-crudAction": null,
                                "x-skaffolder-crudType": null,
                                "x-skaffolder-description": null,
                                "x-skaffolder-returnDesc": null,
                                "x-skaffolder-returnType": null
                              };

                              let service = Offline.createService(api_yaml, methodApi.toLowerCase(), _res);
                              vscode.window.showInformationMessage("API " + nameApi + " created");
                              let trees = refreshTree();

                              // open api view
                              if (trees) {
                                let dbNodes = <SkaffolderNode[]>trees.model.getChildren();

                                dbNodes.forEach((_db_node) => {
                                  _db_node.children.forEach((_res_node) => {
                                    _res_node.children.forEach((_serv_node) => {
                                      if (_serv_node.params && _serv_node.params.service && _serv_node.params.service._id === service["x-skaffolder-id"]) {
                                        ApiView.open(_serv_node);
                                      }
                                    });
                                  });
                                });
                              }
                            }
                          }
                        });
                    } else {
                      vscode.window.showErrorMessage(`There are no more available method for the url "${_res.url}${urlApi}".`);
                    }
                  }
                });
            }
          });
      }
    };

    if (!contextNode) {
      let tree = refreshTree();

      if (tree) {
        let dbTree = <SkaffolderNode[]>tree.model.getChildren();

        if (dbTree && dbTree.length > 0) {
          let dbNodes = dbTree.filter((dbNode) => {
            return dbNode.params && dbNode.params.db && dbNode.params.db._resources && dbNode.params.db._resources.length > 0;
          });

          let askModel = (dbItem: any | undefined) => {
            if (dbItem) {
              let dbNode = (dbItem.item || dbItem) as SkaffolderNode;

              if (dbNode.params && dbNode.params.db) {
                let listModels = dbNode.params.db._resources.map(_res => {
                  return {
                    label: _res.name,
                    _res: _res
                  } as vscode.QuickPickItem;
                });

                vscode.window.showQuickPick(listModels, {
                  placeHolder: "Choose the model"
                }).then(askApi);
              }
            }
          };

          if (dbNodes.length === 1) {
            askModel(dbNodes[0]);
          } else {
            let listDbs = dbNodes.map((val, index) => {
              return {
                label: val.label,
                item: val,
                picked: index === 0
              } as vscode.QuickPickItem;
            });

            vscode.window.showQuickPick(listDbs, {
              placeHolder: "Choose the Database"
            }).then(askModel);
          }
        }
      }
    } else {
      if (contextNode.params) {
        askApi(contextNode.params.model);
      }
    }
  }
}
