import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { ModelView } from "./views/ModelView";
import { ApiView } from "./views/ApiView";

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
          var api_yaml = {
            "x-skaffolder-id-db": contextNode.params && contextNode.params.db ? contextNode.params.db._id : ""
          };
          let service = Offline.createService(api_yaml);
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
      });
  }
}
