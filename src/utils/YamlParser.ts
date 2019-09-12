import { Project } from "../models/jsonreader/project";
import { Db } from "../models/jsonreader/db";
import { Page } from "../models/jsonreader/page";
import { Resource } from "../models/jsonreader/resource";
import { ResourceAttr } from "../models/jsonreader/resource-attr";
import { Service } from "../models/jsonreader/service";
import * as vscode from "vscode";
import * as yaml from "yaml";
import { SkaffolderObject } from "../models/SkaffolderObject";
import { Relation } from "../models/jsonreader/relation";
import { Entity } from "../models/jsonreader/entity";

export class YamlParser {
  static getLinesNumberOf(input: string, word: string): number {
    let lines = input.split("\n");
    let count = 0;
    for (let i in lines) {
      let line = lines[i];
      // console.log("find " + word + " in " + line.indexOf(word) + " " + line);
      if (line.indexOf(word) >= 0) {
        return count;
      }
      count++;
    }
    return -1;
  }

  static parseYaml(fileObj: any, fileString: string): SkaffolderObject {
    console.log("yaml file content", fileObj);

    // Parse project
    let obj: SkaffolderObject = new SkaffolderObject();
    obj.project = new Project({
      _id: fileObj.info["x-skaffolder-id-project"],
      name: fileObj.info.title
    });

    // Parse dbs
    for (let d in fileObj.components["x-skaffolder-db"]) {
      let itemDb = fileObj.components["x-skaffolder-db"][d];
      let db = new Db(itemDb["x-id"], itemDb["x-name"]);

      // Parse resources
      for (let r in fileObj.components["schemas"]) {
        let item = fileObj.components["schemas"][r];

        // find token position of item
        let lineId: number = YamlParser.getLinesNumberOf(
          fileString,
          item["x-skaffolder-id-resource"]
        );
        let pos: vscode.Position = new vscode.Position(
          lineId >= 0 ? lineId - 1 : 0,
          0
        );

        let pos2: vscode.Position = new vscode.Position(lineId + 1, 0);
        let rangeModel: vscode.Range = new vscode.Range(pos, pos2);

        let res = new Resource(
          rangeModel,
          item["x-skaffolder-id-resource"],
          r,
          item["x-skaffolder-url"]
        );

        res._entity._id = item["x-skaffolder-id-entity"];
        // Parse attributes
        for (let a in item.properties) {
          let attrItem = item.properties[a];
          if (attrItem["x-skaffolder-id-attr"]) {
            let attr = new ResourceAttr(a, attrItem);
            res._entity._attrs.push(attr);
          }
        }

        // Parse relations
        for (let r in item["x-skaffolder-relations"]) {
          let relItem = item["x-skaffolder-relations"][r];
          let rel = new Relation(r, relItem);

          res._entity._relations.push(rel);
        }

        // Parse services
        for (let s in fileObj.paths) {
          let serviceItem = fileObj.paths[s];
          for (let m in serviceItem) {
            if (fileObj.paths[s][m]["x-skaffolder-resource"] === res.name) {
              // find token position of item
              let lineId: number = YamlParser.getLinesNumberOf(
                fileString,
                fileObj.paths[s][m]["x-skaffolder-id-api"]
              );
              let pos: vscode.Position = new vscode.Position(
                lineId >= 0 ? lineId - 2 : 0,
                0
              );

              let pos2: vscode.Position = new vscode.Position(lineId + 1, 0);
              let rangeApi: vscode.Range = new vscode.Range(pos, pos2);

              let service = new Service(rangeApi, m, fileObj.paths[s][m]);

              res._services.push(service);
            }
          }
        }

        db._resources.push(res);
      }

      // populate resources
      db._resources.forEach(res => {
        res._entity._relations.forEach(rel => {
          let ent1: Entity = YamlParser.searchRel(db, String(rel._ent1));
          let ent2: Entity = YamlParser.searchRel(db, String(rel._ent2));

          rel._ent1 = ent1;
          rel._ent2 = ent2;
        });
      });

      obj.resources.push(db);
    }

    // Parse pages
    for (let p in fileObj.components["x-skaffolder-page"]) {
      let item = fileObj.components["x-skaffolder-page"][p];
      // find token position of item
      let lineId: number = YamlParser.getLinesNumberOf(
        fileString,
        item["x-id"]
      );
      let pos: vscode.Position = new vscode.Position(
        lineId >= 0 ? lineId : 0,
        0
      );

      let pos2: vscode.Position = new vscode.Position(lineId + 2, 0);
      let rangePage: vscode.Range = new vscode.Range(pos, pos2);

      let page = new Page(rangePage, item);
      obj.modules.push(page);
    }

    // Populate pages
    obj.modules.forEach(page => {
      if (page._services) {
        page._services.forEach((service: any) => {
          service = YamlParser.searchService(obj.resources, service);
        });
      }
    });

    console.log("Parser result:", obj);
    return obj;
  }
  static searchService(
    resources: Db[],
    serviceId: string
  ): Service | undefined {
    for (let d in resources) {
      let db: Db = resources[d];

      for (let r in db._resources) {
        let res = db._resources[r];

        for (let s in res._services) {
          let serv = res._services[s];

          if (serv._id === serviceId) {
            return serv;
          }
        }
      }
    }
    console.error("Service not found with id " + serviceId);

    return undefined;
  }

  static searchRel(db: Db, rel_id: string): Entity {
    for (let r in db._resources) {
      let entity = db._resources[r]._entity;
      if (entity._id === rel_id) {
        return new Entity(entity.name, entity._id);
      }
    }
    return new Entity();
  }

  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public modules: Page[] = [];
}
