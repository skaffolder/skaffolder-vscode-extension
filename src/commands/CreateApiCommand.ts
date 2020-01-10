import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { ApiView } from "./views/ApiView";
import { DataService } from "../services/DataService";

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

          if (contextNode.params && contextNode.params.model && contextNode.params.model._id) {
            var _res = DataService.findResource(contextNode.params.model._id);

            if (_res) {
              var api_yaml = {
                "x-skaffolder-name": nameApi,
                "x-skaffolder-id-resource": _res._id,
                "x-skaffolder-resource": _res.name,
                "x-skaffolder-url": "/custom_api",
                "x-skaffolder-crudAction": null,
                "x-skaffolder-crudType": null,
                "x-skaffolder-description": null,
                "x-skaffolder-returnDesc": null,
                "x-skaffolder-returnType": null
              };

              let service = Offline.createService(api_yaml, "get", _res);
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
        }
      });
  }
}
