import * as fs from "fs";
import * as SkaffolderCli from "skaffolder-cli";
import * as yaml from "yaml";
import * as vscode from "vscode";
import * as Handlebars from "handlebars";

import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";
import { YamlParser } from "../utils/YamlParser";
import { Resource } from "../models/jsonreader/resource";
import { Page } from "../models/jsonreader/page";
import * as path from "path";

SkaffolderCli.registerHelpers(Handlebars);

export class DataService {
  private static dataObj: SkaffolderObject;
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

  static findRelatedFiles(type: string, item: Resource | Page, itemDb?: Db) {
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

    return DataService.templateFilesCateg.resource.concat(
      DataService.templateFilesCateg.table
    );
  }

  static getTemplateFiles(): SkaffolderCli.GeneratorFile[] {
    if (DataService.templateFiles === undefined) {
      DataService.resetTemplateFiles();
    }

    return DataService.templateFiles;
  }

  static resetTemplateFiles() {
    DataService.templateFiles = SkaffolderCli.getGenFiles(
      vscode.workspace.rootPath + "/.skaffolder/template"
    );

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
    let contexturl = vscode.Uri.file(
      vscode.workspace.rootPath + "/openapi.yaml"
    );
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
    let contexturl = vscode.Uri.file(
      vscode.workspace.rootPath + "/openapi.yaml"
    );
    let dataYaml: string = "";
    try {
      console.log("read file");
      dataYaml = fs.readFileSync(contexturl.path, "utf-8");
    } catch (e) {
      console.error('File "openapi.yaml" not found', e);
      vscode.window.showWarningMessage("Workspace has no openapi.yaml");
    }

    if (dataYaml !== "") {
      let fileObj = yaml.parse(dataYaml);
      DataService.dataObj = YamlParser.parseYaml(fileObj, dataYaml);
    }

    return;
  }

  public static getSkObject() {
    if (!DataService.dataObj) {
      DataService.refreshData();
    }
    return DataService.dataObj;
  }

  public static getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }
}
