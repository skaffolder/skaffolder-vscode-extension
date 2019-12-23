import * as vscode from "vscode";
import * as path from "path";

import { SkaffolderNode } from "../SkaffolderNode";

export class ModelResourceNode {
  /**
   * Create node for each Model in the Db
   */
  static execute(node: SkaffolderNode, indexMap: number[]) {
    // Set resource
    let db = node.skaffolderObject.resources[indexMap[0]];
    let resource = db._resources[indexMap[1]];
    node.label = resource.name;
    node.description = resource.url;
    node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    node.iconPath = {
      light: node.context.asAbsolutePath(path.join("media", "light", "model.svg")),
      dark: node.context.asAbsolutePath(path.join("media", "dark", "model.svg"))
    };
    node.contextValue = "model";

    // Set params node
    node.params = {
      type: "resource",
      db: db,
      model: resource,
      range: resource.index
    };

    // Find children
    if (resource._services && resource._services.length > 0) {
      resource._services.forEach((element, index) => {
        let indexArr: number[] = [indexMap[0], indexMap[1], index];
        node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "api_db_resource_api", indexArr));
      });
    } else {
      node.children.push(new SkaffolderNode(node.context, node.skaffolderObject, "api_db_resource_api_notfound", []));
      node.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }
  }
}
