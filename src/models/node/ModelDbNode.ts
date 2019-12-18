import * as vscode from "vscode";
import * as path from "path";

import { SkaffolderNode } from "../SkaffolderNode";

export class ModelDbNode {
  /**
   * Create node for each Db in the project
   */
  static execute(node: SkaffolderNode, indexMap: number[]) {
    // Set db
    let db = node.skaffolderObject.resources[indexMap[0]];
    node.label = db.name;
    node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    node.iconPath = {
      light: node.context.asAbsolutePath(path.join("media", "light", "database.svg")),
      dark: node.context.asAbsolutePath(path.join("media", "dark", "database.svg"))
    };

    node.params = {
      type: "db",
      db: db,
      range: db.index
    };

    // Find children
    db._resources.forEach((element, index) => {
      let indexArr: number[] = [indexMap[0], index];
      node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "model_db_resource", indexArr));
    });
  }
}
