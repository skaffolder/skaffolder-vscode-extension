import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { Resource } from "./jsonreader/resource";
import { ResourceAttr } from "./jsonreader/resource-attr";
import { Service } from "./jsonreader/service";
import * as vscode from "vscode";
import * as yaml from "yaml";

export class SkaffolderObject {
  static getLinesNumberOf(input: string, word: string): number {
    let lines = input.split("\n");
    let count = 0;
    for (let i in lines) {
      let line = lines[i];
      console.log("find " + word + " in " + line.indexOf(word) + " " + line);
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
      name: fileObj.info.name
    });

    // Parse dbs
    for (let d in fileObj.components["x-skaffolder-db"]) {
      let itemDb = fileObj.components["x-skaffolder-db"][d];
      let db = new Db(itemDb["x-id"], itemDb["x-name"]);

      // Parse resources
      for (let r in fileObj.components["schemas"]) {
        let item = fileObj.components["schemas"][r];

        // find token position of item
        let lineId: number = SkaffolderObject.getLinesNumberOf(
          fileString,
          item["x-skaffolder-id-model"]
        );
        let pos: vscode.Position = new vscode.Position(
          lineId >= 0 ? lineId - 1 : 0,
          0
        );

        let pos2: vscode.Position = new vscode.Position(lineId + 1, 0);
        let rangeModel: vscode.Range = new vscode.Range(pos, pos2);

        let res = new Resource(rangeModel, item["x-skaffolder-id-model"], r);

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

    console.log("Parser result:", obj);
    return obj;
  }

  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public modules: Page[] = [];
}
