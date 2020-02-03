import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { ModelView } from "./views/ModelView";
import { Db } from "../models/jsonreader/db";

export class CreateModelCommand {
  static async command(contextNode: SkaffolderNode) {
    if (vscode.workspace.rootPath === undefined) {
      vscode.window.showInformationMessage("Please open a workspace!");
      return;
    }
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }

    let askModel = (dbItem: any | undefined) => {
      if (dbItem && dbItem.params && dbItem.params.db) {
        let dbNode = dbItem.params.db as Db;

        vscode.window
          .showInputBox({
            placeHolder: "Insert the name of your model"
          })
          .then(nameModel => {
            if (nameModel) {
              let model = Offline.createModel(nameModel, {
                "x-skaffolder-id-db": dbNode._id
              });

              vscode.window.showInformationMessage("Model " + nameModel + " created");
              let trees = refreshTree();

              // Open model view
              if (trees) {
                let dbNodes = <SkaffolderNode[]>trees.model.getChildren();

                dbNodes.forEach((_db_node) => {
                  _db_node.children.forEach((_res_node) => {
                    if (_res_node.params && _res_node.params.model && _res_node.params.model._id === model["x-skaffolder-id"]) {
                      ModelView.open(_res_node);
                    }
                  });
                });
              }
            }
          });
      }
    };

    if (!contextNode) {
      let tree = refreshTree();

      if (tree) {
        let dbTree = <SkaffolderNode[]>tree.model.getChildren();

        if (dbTree && dbTree.length > 0) {
          if (dbTree.length === 1) {
            askModel(dbTree[0]);
          } else {
            let listDbs = dbTree.map((val, index) => {
              return {
                label: val.label,
                params: val.params,
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
      askModel(contextNode);
    }
  }
}
