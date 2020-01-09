import * as fs from "fs";
import * as SkaffolderCli from "skaffolder-cli";
import * as yaml from "yaml";
import * as vscode from "vscode";
import * as Handlebars from "handlebars";

import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";
import { Resource } from "../models/jsonreader/resource";
import { Page } from "../models/jsonreader/page";
import { Project } from "../models/jsonreader/project";
import { Entity } from "../models/jsonreader/entity";
import { ResourceAttr } from "../models/jsonreader/resource-attr";
import { Service } from "../models/jsonreader/service";

SkaffolderCli.registerHelpers(Handlebars);

export class DataService {
  private static dataObj: SkaffolderObject;
  private static yamlObj: any;
  private static mapResource: Map<String, Resource> | undefined;
  private static mapService: Map<String, Service> | undefined;
  private static templateFiles: SkaffolderCli.GeneratorFile[];
  private static templateFilesCateg: {
    db: SkaffolderCli.GeneratorFile[];
    module: SkaffolderCli.GeneratorFile[];
    table: SkaffolderCli.GeneratorFile[];
    resource: SkaffolderCli.GeneratorFile[];
    oneTime: SkaffolderCli.GeneratorFile[];
  };

  constructor() {
    if (!DataService.dataObj) {
      DataService.refreshData();
    }
  }

  static findRelatedFiles(type: string, item: Resource | Page | Db, itemDb?: Db) {
    let paths: string[] = [];
    let files: SkaffolderCli.GeneratorFile[] = [];

    let param: any = DataService.dataObj;
    if (type === "resource") {
      files = DataService.getTemplateFilesForResource();
      param.resource = item;
      param.entity = (item as Resource)._entity;
      param.db = itemDb;
    } else if (type === "module") {
      files = DataService.getTemplateFilesForPage();
      param.module = item;
      param.db = itemDb;
    } else if (type === "db") {
      files = DataService.getTemplateFilesForDb();
      param.db = item;
    }

    files.forEach(file => {
      let fileName = file.name;
      let template = Handlebars.compile(file.name);
      try {
        fileName = template(param);
      } catch (e) {
        console.error(e);
      }
      paths.push(fileName);
    });

    return paths;
  }

  static getTemplateFilesForDb(): SkaffolderCli.GeneratorFile[] {
    if (DataService.templateFiles === undefined) {
      DataService.resetTemplateFiles();
    }

    return DataService.templateFilesCateg.db;
  }

  static getTemplateFilesForPage(): SkaffolderCli.GeneratorFile[] {
    if (DataService.templateFiles === undefined) {
      DataService.resetTemplateFiles();
    }

    return DataService.templateFilesCateg.module;
  }

  static getTemplateFilesForResource(): SkaffolderCli.GeneratorFile[] {
    if (DataService.templateFiles === undefined) {
      DataService.resetTemplateFiles();
    }

    return DataService.templateFilesCateg.resource.concat(DataService.templateFilesCateg.table);
  }

  static getTemplateFiles(): SkaffolderCli.GeneratorFile[] {
    if (DataService.templateFiles === undefined) {
      DataService.resetTemplateFiles();
    }

    return DataService.templateFiles;
  }

  static resetTemplateFiles() {
    DataService.templateFiles = SkaffolderCli.getGenFiles(vscode.workspace.rootPath + "/.skaffolder/template");

    DataService.templateFilesCateg = {
      module: [],
      resource: [],
      table: [],
      oneTime: [],
      db: []
    };
    DataService.templateFiles.forEach(file => {
      if (file.forEachObj === "module") {
        DataService.templateFilesCateg.module.push(file);
      } else if (file.forEachObj === "resource") {
        DataService.templateFilesCateg.resource.push(file);
      } else if (file.forEachObj === "table") {
        DataService.templateFilesCateg.table.push(file);
      } else if (file.forEachObj === "db") {
        DataService.templateFilesCateg.db.push(file);
      } else {
        DataService.templateFilesCateg.oneTime.push(file);
      }
    });
  }

  static isSkaffolderProject(): boolean {
    let contexturl = vscode.Uri.file(vscode.workspace.rootPath + "/openapi.yaml");
    return fs.existsSync(contexturl.path);
  }

  public static refreshData() {
    // Example JSON
    // let data = fs.readFileSync(
    //   __dirname + "/../../src/services/dataExample.json",
    //   "utf-8"
    // );
    // DataService.dataObj = JSON.parse(data);

    // Example yaml
    // let dataYaml: string = fs.readFileSync(
    //   __dirname + "/../../src/services/dataExampleOpenAPI3.yaml",
    //   "utf-8"
    // );

    // read file in workspace
    let contexturl = vscode.Uri.file(vscode.workspace.rootPath + "/openapi.yaml");
    let dataYaml: string = "";
    try {
      // Read file
      dataYaml = fs.readFileSync(contexturl.path, "utf-8");
    } catch (e) {
      console.error('File "openapi.yaml" not found', e);
      vscode.window.showWarningMessage("Workspace has no openapi.yaml");
    }

    if (dataYaml !== "") {
      let fileObj;
      try {
        fileObj = yaml.parse(dataYaml);
      } catch (e) {
        console.error('File "openapi.yaml" not parsable');
        console.error(e);
        vscode.window.showErrorMessage(e.message);
        vscode.window.showErrorMessage('File "openapi.yaml" not parsable');
        throw e;
      }

      DataService.yamlObj = fileObj;
      let yamlObjCopy: any;
      yamlObjCopy = JSON.parse(JSON.stringify(fileObj));
      try {
        // DataService.dataObj = YamlParser.parseYaml(yamlObjCopy, dataYaml);
        DataService.dataObj = SkaffolderCli.getProjectData(
          {
            info: function(msg: string) {
              vscode.window.showInformationMessage(msg);
            }
          },
          vscode.workspace.rootPath + "/"
        );
      } catch (e) {
        console.error("Error in parsing YAML");
        console.error(e);
        vscode.window.showErrorMessage(e.message);
        vscode.window.showErrorMessage("Error in parsing YAML");
        throw e;
      }
    }

    DataService.mapResource = undefined;
    DataService.mapService = undefined;
    return;
  }

  static findApi(_id: string): Service | undefined {
    if (!DataService.mapService) {
      DataService.mapService = new Map<String, Service>();

      DataService.getSkObject().resources.forEach(db => {
        db._resources.forEach(res => {
          res._services.forEach(serv => {
            (DataService.mapService as Map<String, Service>).set(serv._id, serv);
          });
        });
      });
    }
    return (DataService.mapService as Map<String, Service>).get(_id);
  }

  static findResource(_id: string): Resource | undefined {
    if (!DataService.mapResource) {
      DataService.mapResource = new Map<String, Resource>();

      DataService.getSkObject().resources.forEach(db => {
        db._resources.forEach(res => {
          (DataService.mapResource as Map<String, Resource>).set(res._id, res);
        });
      });
    }
    return (DataService.mapResource as Map<String, Resource>).get(_id);
  }

  public static getSkObject() {
    if (!DataService.dataObj) {
      DataService.refreshData();
    }
    return DataService.dataObj;
  }

  static getYaml(): any {
    if (!DataService.yamlObj) {
      DataService.refreshData();
    }
    return DataService.yamlObj;
  }

  public static getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }

  public static createSkObj(nameProj: string) {
    // Create SkObj
    let skObj = new SkaffolderObject();

    // Create Project
    let project = new Project({
      name: nameProj,
      _id: ""
    });
    skObj.project = project;

    // Create Db
    let db = new Db("", nameProj + "_db");
    skObj.resources = [db];

    // Create Resource
    let resource = new Resource(undefined, "", "User", "/Users", "", "users");

    // Create Attributes
    let attributes: ResourceAttr[] = [];
    attributes.push(
      new ResourceAttr("username", {
        "x-skaffolder-type": "String",
        "x-skaffolder-required": true
      })
    );
    attributes.push(
      new ResourceAttr("password", {
        "x-skaffolder-type": "String",
        "x-skaffolder-required": true
      })
    );
    attributes.push(
      new ResourceAttr("mail", {
        "x-skaffolder-type": "String"
      })
    );
    attributes.push(
      new ResourceAttr("name", {
        "x-skaffolder-type": "String"
      })
    );
    attributes.push(
      new ResourceAttr("surname", {
        "x-skaffolder-type": "String"
      })
    );
    attributes.push(
      new ResourceAttr("roles", {
        "x-skaffolder-type": "String"
      })
    );

    // Create Service

    resource._services = [
      {
        _id: "",
        name: "create",
        crudAction: "create",
        index: undefined,
        method: "POST",
        url: "/",
        description: "CRUD ACTION create",
        returnType: "",
        _roles: [],
        _params: []
      },
      {
        _id: "",
        name: "update",
        crudAction: "update",
        index: undefined,
        method: "POST",
        url: "/{id}",
        description: "CRUD ACTION update",
        returnType: "",
        _roles: [],
        _params: [
          {
            name: "id",
            type: "ObjectId",
            description: "Id"
          }
        ]
      },
      {
        _id: "",
        name: "get",
        crudAction: "get",
        index: undefined,
        method: "GET",
        url: "/{id}",
        description: "CRUD ACTION get",
        returnType: "",
        _roles: [],
        _params: [
          {
            name: "id",
            type: "ObjectId",
            description: "Id resource"
          }
        ]
      },
      {
        _id: "",
        name: "delete",
        crudAction: "delete",
        index: undefined,
        method: "DELETE",
        url: "/{id}",
        description: "CRUD ACTION delete",
        returnType: "",
        _roles: [],
        _params: [
          {
            name: "id",
            type: "ObjectId",
            description: "Id"
          }
        ]
      },
      {
        _id: "",
        name: "list",
        crudAction: "list",
        index: undefined,
        method: "GET",
        url: "/",
        description: "CRUD ACTION list",
        returnType: "",
        _roles: [],
        _params: []
      },
      {
        _id: "",
        name: "changePassword",
        index: undefined,
        method: "POST",
        url: "/{id}/changePassword",
        description: "Change password of user from admin",
        returnType: "Object",
        _roles: [],
        _params: []
      }
    ];

    // Assign resource
    (resource._entity as Entity)._attrs = attributes;
    db._resources.push(resource);

    // Create Home
    skObj.modules = [
      {
        index: undefined,
        name: "Home",
        url: "/home",
        _id: "",
        _template_resource: "",
        _links: [],
        _nesteds: [],
        _services: [],
        _resources: []
      }
    ];
    return skObj;
  }

  static readConfig(): any {
    let config = {};
    try {
      let configFile = fs.readFileSync(vscode.workspace.rootPath + "/.skaffolder/config.json", "utf-8");
      try {
        config = JSON.parse(configFile);
      } catch (e) {
        vscode.window.showErrorMessage(".skaffolder/config.json JSON not parsable");
      }
    } catch (e) {
      vscode.window.showErrorMessage(".skaffolder/config.json JSON not found");
    }
    return config;
  }

  static exportProject(params: any, cb: any) {
    SkaffolderCli.exportProject(params, cb);
  }
}
