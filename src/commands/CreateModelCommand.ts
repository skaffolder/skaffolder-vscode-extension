import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { ModelView } from "./views/ModelView";

export class CreateModelCommand {
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
        placeHolder: "Insert the name of your model"
      })
      .then(nameModel => {
        if (nameModel) {
          var model_yaml = {
            "x-skaffolder-id-db": contextNode.params && contextNode.params.db ? contextNode.params.db._id : ""
          };
          let model = Offline.createModel(nameModel, model_yaml);
          vscode.window.showInformationMessage("Model " + nameModel + " created");
          let trees = refreshTree();

          // Open model view
          if (trees) {
            let modelNodes: any = trees.model.getChildren();
            for (let p in modelNodes) {
              let modelNode: SkaffolderNode = modelNodes[p];
              if (modelNode.params && modelNode.params.model && modelNode.params.model._id === model["x-skaffolder-id"]) {
                ModelView.open(modelNode);
              }
            }
          }
        }
      });
  }
}
