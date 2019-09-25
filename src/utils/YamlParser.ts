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
    let dbs: Map<
      string,
      {
        dbObj: Db;
        dbEntityObj: Db;
      }
    > = new Map<
      string,
      {
        dbObj: Db;
        dbEntityObj: Db;
      }
    >();
    let unamedDb = new Db("", "Unamed_Db");
    let unamedDbObj = {
      dbObj: unamedDb,
      dbEntityObj: unamedDb
    };

    for (let d in fileObj.components["x-skaffolder-db"]) {
      let itemDb = fileObj.components["x-skaffolder-db"][d];

      // find token position of item
      let lineId: number = YamlParser.getLinesNumberOf(
        fileString,
        "x-skaffolder-id: " + itemDb["x-skaffolder-id"]
      );
      let pos: vscode.Position = new vscode.Position(
        lineId >= 0 ? lineId - 1 : 0,
        0
      );

      let pos2: vscode.Position = new vscode.Position(lineId + 1, 0);
      let rangeModel: vscode.Range = new vscode.Range(pos, pos2);

      let db = new Db(
        itemDb["x-skaffolder-id"],
        itemDb["x-skaffolder-name"],
        rangeModel
      );
      let dbEntity = new Db(
        itemDb["x-skaffolder-id"],
        itemDb["x-skaffolder-name"],
        rangeModel
      );

      dbs.set(db._id, {
        dbObj: db,
        dbEntityObj: dbEntity
      });
    }

    // Parse resources
    for (let r in fileObj.components["schemas"]) {
      let item = fileObj.components["schemas"][r];

      // find token position of item
      let lineId: number = YamlParser.getLinesNumberOf(
        fileString,
        "x-skaffolder-id: " + item["x-skaffolder-id"]
      );
      let pos: vscode.Position = new vscode.Position(
        lineId >= 0 ? lineId : 0,
        0
      );

      let pos2: vscode.Position = new vscode.Position(lineId + 2, 0);
      let rangeModel: vscode.Range = new vscode.Range(pos, pos2);

      let res = new Resource(
        rangeModel,
        item["x-skaffolder-id"],
        r,
        item["x-skaffolder-url"],
        item["x-skaffolder-id-db"],
        r === "User" ? "User" : undefined
      );

      let entity: Entity = res._entity as Entity;
      entity._id = item["x-skaffolder-id-entity"];
      // Parse attributes
      for (let a in item.properties) {
        let attrItem = item.properties[a];
        if (attrItem) {
          if (attrItem["x-skaffolder-id-attr"]) {
            let attr = new ResourceAttr(a, attrItem);
            entity._attrs.push(attr);
          }
        }
      }

      // Parse relations
      for (let r in item["x-skaffolder-relations"]) {
        let relItem = item["x-skaffolder-relations"][r];
        let rel = new Relation(r, relItem);

        entity._relations.push(rel);
        res._relations.push(rel);
      }

      // Parse services
      for (let s in fileObj.paths) {
        let serviceItem = fileObj.paths[s];
        for (let m in serviceItem) {
          if (fileObj.paths[s][m]["x-skaffolder-resource"] === res.name) {
            // find token position of item
            let lineId: number = YamlParser.getLinesNumberOf(
              fileString,
              fileObj.paths[s][m]["x-skaffolder-id"]
            );
            let pos: vscode.Position = new vscode.Position(
              lineId >= 0 ? lineId - 1 : 0,
              0
            );

            let pos2: vscode.Position = new vscode.Position(lineId + 1, 0);
            let rangeApi: vscode.Range = new vscode.Range(pos, pos2);

            let service = new Service(rangeApi, m, fileObj.paths[s][m]);

            res._services.push(service);
          }
        }
      }

      let db = dbs.get(res._db);
      if (db) {
        db.dbObj._resources.push(res);
        db.dbEntityObj._entity.push(res._entity as Entity);
      } else {
        unamedDbObj.dbObj._resources.push(res);
        unamedDbObj.dbEntityObj._entity.push(res._entity as Entity);
      }
    }

    // Set dbs
    dbs.forEach(value => {
      obj.dbs.push(value.dbEntityObj);
      obj.resources.push(value.dbObj);
    });

    if (unamedDbObj.dbEntityObj._entity.length > 0) {
      obj.dbs.push(unamedDbObj.dbEntityObj);
      obj.resources.push(unamedDbObj.dbObj);
    }

    // Parse pages
    for (let p in fileObj.components["x-skaffolder-page"]) {
      let item = fileObj.components["x-skaffolder-page"][p];
      // find token position of item
      let lineId: number = YamlParser.getLinesNumberOf(
        fileString,
        item["x-skaffolder-id"]
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

    // POPULATE

    obj.resources.forEach(db => {
      // populate resources
      db._resources.forEach(res => {
        // populate relations
        (res._entity as Entity)._relations.forEach(rel => {
          let ent1: Entity = YamlParser.searchRel(db, String(rel._ent1));
          let ent2: Entity = YamlParser.searchRel(db, String(rel._ent2));

          rel._ent1 = ent1;
          rel._ent2 = ent2;
        });

        // populate services
        res._services.forEach(serv => {
          serv._resource = YamlParser.searchResource(
            obj.resources,
            String(serv._resource)
          );
        });

        res._services = YamlParser.orderByName(res._services);
      });
    });

    obj.modules.forEach(page => {
      // Populate pages
      if (page._services) {
        let resourcesMap: Map<String, Resource> = new Map<String, Resource>();
        page._services.forEach((service: any, index: number) => {
          page._services[index] = YamlParser.searchService(
            obj.resources,
            service
          );

          let resJSon = (page._services[index] as Service)._resource;
          if (resJSon) {
            let res: Resource = resJSon;
            resourcesMap.set(res._id, res);
          }
        });

        resourcesMap.forEach(item => {
          page._resources.push(item);
        });
      }

      // Populate links
      if (
        page._links !== null &&
        page._links !== undefined &&
        page._links instanceof Array
      ) {
        page._links.forEach((pageItem: any, index: number) => {
          page._links[index] = YamlParser.searchPage(obj.modules, pageItem);
        });
      }

      // Populate nesteds
      if (
        page._nesteds !== null &&
        page._nesteds !== undefined &&
        page._nesteds instanceof Array
      ) {
        page._nesteds.forEach((pageItem: any, index: number) => {
          page._nesteds[index] = YamlParser.searchPage(obj.modules, pageItem);
        });
      }
    });

    console.log("Parser result:", obj);
    return obj;
  }
  static orderByName(services: Service[]): Service[] {
    return services.sort((a, b) => {
      return a.name > b.name ? 1 : 0;
    });
  }

  static searchResource(resources: Db[], resId: string): Resource | undefined {
    for (let d in resources) {
      let db: Db = resources[d];

      for (let r in db._resources) {
        let res = JSON.parse(JSON.stringify(db._resources[r]));

        if (res._id === resId) {
          // clean
          res._entity = String((res._entity as Entity)._id);
          res._services = JSON.parse(
            JSON.stringify(
              res._services.map((serv: { _id: any }) => {
                return serv ? serv._id : null;
              })
            )
          );
          return res;
        }
      }
    }
    console.error("Resource not found with id " + resId);

    return;
  }

  static searchPage(pages: Page[], pageId: string): Page | string {
    for (let p in pages) {
      let page: Page = JSON.parse(JSON.stringify(pages[p]));

      if (page._id === pageId) {
        // clean
        page._links = [];
        page._nesteds = [];
        if (page._services) {
          page._services = (page._services as Service[]).map(
            (serv: { _id: any }) => {
              return serv ? serv._id : null;
            }
          );
        }

        return page;
      }
    }
    console.error("Page not found with id " + pageId);

    return "";
  }

  static searchService(resources: Db[], serviceId: string): Service | string {
    for (let d in resources) {
      let db: Db = resources[d];

      for (let r in db._resources) {
        let res = db._resources[r];

        for (let s in res._services) {
          let serv = JSON.parse(JSON.stringify(res._services[s]));

          if (serv._id === serviceId) {
            // clean
            if (serv._resource) {
              serv._resource._services = [];
              serv._resource._entity = String(
                (serv._resource._entity as Entity)._id
              );
            }
            return serv;
          }
        }
      }
    }
    console.error("Service not found with id " + serviceId);

    return "";
  }

  static searchRel(db: Db, rel_id: string): Entity {
    for (let r in db._resources) {
      let entity = db._resources[r]._entity as Entity;
      if (entity._id === rel_id) {
        return new Entity(entity.name, entity._id, db._id, db._resources[r]);
      }
    }
    return new Entity();
  }

  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public modules: Page[] = [];
}
