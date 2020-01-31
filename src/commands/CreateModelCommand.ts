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
          let model: any;

          if (contextNode) {
            var model_yaml = {
              "x-skaffolder-id-db": contextNode.params && contextNode.params.db ? contextNode.params.db._id : ""
            };
            
            model = Offline.createModel(nameModel, model_yaml);
          } else {
            model = Offline.createModel(nameModel, {});
          }
          vscode.window.showInformationMessage("Model " + nameModel + " created");
          let trees = refreshTree();

          // Open model view
          if (trees) {
            let dbNodes = <SkaffolderNode[]>trees.model.getChildren();

            dbNodes.forEach((_db_node) => {
              if (contextNode.params && contextNode.params.db && contextNode.params.db.name === _db_node.label) {
                _db_node.children.forEach((_res_node) => {
                  if (_res_node.params && _res_node.params.model && _res_node.params.model._id === model["x-skaffolder-id"]) {
                    ModelView.open(_res_node);
                  }
                });
              }
            });
          }
        }
      });
  }
}
