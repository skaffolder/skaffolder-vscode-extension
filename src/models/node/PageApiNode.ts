import * as path from "path";
import { SkaffolderNode } from "../SkaffolderNode";
import { Service } from "../jsonreader/service";
import { DataService } from "../../services/DataService";
import { Resource } from "../jsonreader/resource";

export class PageApiNode {
  /**
   * Create node for each API in the page
   */
  static execute(
    node: SkaffolderNode,

    indexMap: number[]
  ) {
    // Execute command
    node.command = {
      command: "skaffolder.editNode",
      title: "Edit",
      arguments: [node]
    };

    // Set api
    let apiPage = node.skaffolderObject.modules[indexMap[0]]._services[indexMap[1]] as Service;

    // Find api
    let api: Service = DataService.findApi(apiPage._id) as Service;
    let resource: Resource = DataService.findResource((api._resource as Resource)._id) as Resource;

    // Find db api
    let db;
    let dbId = (api._resource as Resource)._db;
    node.skaffolderObject.resources.forEach(item => {
      if (item._id === dbId) {
        db = item;
      }
    });
    node.label = resource.name + "." + api.name;
    node.description = resource.url + api.url;
    node.tooltip = api.method;
    node.iconPath = {
      light: node.context.asAbsolutePath(path.join("media", "light", "api_" + api.method + ".svg")),
      dark: node.context.asAbsolutePath(path.join("media", "dark", "api_" + api.method + ".svg"))
    };
    node.contextValue = "service";
    node.params = {
      type: "service",
      db: db,
      model: resource,
      service: api,
      range: api.index
    };
  }
}
