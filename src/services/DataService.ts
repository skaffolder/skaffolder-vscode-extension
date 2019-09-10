import * as fs from "fs";
import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";
import * as yaml from "yaml";
import * as vscode from "vscode";

import { Project } from "../models/jsonreader/project";
import { Resource } from "../models/jsonreader/resource";
import { ResourceAttr } from "../models/jsonreader/resource-attr";
import { Entity } from "../models/jsonreader/entity";
import { Service } from "../models/jsonreader/service";
import { YamlParser } from "../utils/YamlParser";

export class DataService {
  private static dataObj: SkaffolderObject;

  constructor() {
    if (!DataService.dataObj) {
      DataService.refreshData();
    }
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

  public getSkObject() {
    return DataService.dataObj;
  }

  public getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }
}
