import * as fs from "fs";
import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";
import * as yaml from "yaml";
import { Project } from "../models/jsonreader/project";
import { Resource } from "../models/jsonreader/resource";
import { ResourceAttr } from "../models/jsonreader/resource-attr";
import { Entity } from "../models/jsonreader/entity";
import { Service } from "../models/jsonreader/service";

export class DataService {
  private static dataObj: SkaffolderObject;

  constructor() {
    if (!DataService.dataObj) {
      // let data = fs.readFileSync(
      //   __dirname + "/../../src/services/dataExample.json",
      //   "utf-8"
      // );
      // DataService.dataObj = JSON.parse(data);

      let dataYaml = fs.readFileSync(
        __dirname + "/../../src/services/dataExampleOpenAPI3.yaml",
        "utf-8"
      );
      let fileObj = yaml.parse(dataYaml);
      DataService.dataObj = this.parseYaml(fileObj);
    }
  }

  private parseYaml(fileObj: any): SkaffolderObject {
    console.log(fileObj);
    // Parse project
    let obj: SkaffolderObject = new SkaffolderObject();
    obj.project = new Project({
      _id: fileObj.info["x-skaffolder-id-project"],
      name: fileObj.info.name
    });

    // Parse dbs
    for (let d in fileObj.components["x-skaffolder-db"]) {
      let itemDb = fileObj.components["x-skaffolder-db"][d];
      let db = new Db(itemDb["x-id"], itemDb["x-name"]);

      // Parse resources
      for (let r in fileObj.components["schemas"]) {
        let item = fileObj.components["schemas"][r];
        let res = new Resource(item["x-id"], "", r);

        // Parse attributes
        for (let a in item.properties) {
          let attrItem = item.properties[a];
          let attr = new ResourceAttr("", a, attrItem.type);

          res._entity._attrs.push(attr);
        }

        // Parse services
        for (let s in fileObj.paths) {
          let serviceItem = fileObj.paths[s];
          for (let m in serviceItem) {
            if (fileObj.paths[s][m]["x-resource"] === res.name) {
              let service = new Service(
                m,
                fileObj.paths[s][m]["x-skaffolder-name-api"]
              );

              res._services.push(service);
            }
          }
        }

        db._resources.push(res);
      }
      obj.resources.push(db);
    }

    console.log(obj);
    return obj;
  }

  public getSkObject() {
    return DataService.dataObj;
  }

  public getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }
}
