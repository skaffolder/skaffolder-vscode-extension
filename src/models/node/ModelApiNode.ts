import * as path from "path";
import { SkaffolderNode } from "../SkaffolderNode";
import { Commands } from "../../utils/Commands";
import { EditNodeCommand } from "../../commands/EditNodeCommand";

export class ModelApiNode {
  /**
   * Create node for each API in the model
   */
  static execute(node: SkaffolderNode, indexMap: number[]) {
    // Set api
    let db = node.skaffolderObject.resources[indexMap[0]];
    let model = db._resources[indexMap[1]];
    let api = model._services[indexMap[2]];
    node.tooltip = api.method.toUpperCase() + " " + api.url;
    node.label = api.name;
    node.description = api.url;

    // Execute command
    node.command = {
      command: "skaffolder.editNode",
      title: "Edit",
      arguments: [node]
    };

    node.iconPath = {
      light: node.context.asAbsolutePath(
        path.join(
          "media",
          "light",
          "api_" + node.skaffolderObject.resources[indexMap[0]]._resources[indexMap[1]]._services[indexMap[2]].method + ".svg"
        )
      ),
      dark: node.context.asAbsolutePath(
        path.join(
          "media",
          "dark",
          "api_" + node.skaffolderObject.resources[indexMap[0]]._resources[indexMap[1]]._services[indexMap[2]].method + ".svg"
        )
      )
    };
    node.params = {
      type: "service",
      db: db,
      model: model,
      service: api,
      range: api.index
    };
  }
}
