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
    //Ask name
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

                if (contextNode.params && contextNode.params.model) {
                  var _res = contextNode.params.model as Resource;

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

                            // Open model view
                            if (trees) {
                              let apiNodes: any = trees.model.getChildren();
                              for (let p in apiNodes) {
                                let apiNode: SkaffolderNode = apiNodes[p];
                                if (apiNode.params && apiNode.params.service && apiNode.params.service._id === service["x-skaffolder-id"]) {
                                  ApiView.open(apiNode);
                                }
                              }
                            }
                          }
                        }
                      });
                  } else {
                    vscode.window.showErrorMessage(`There are no more available method for the url "${_res.url}${urlApi}".`);
                  }
                }
              }
            });
        }
      });
  }
}
