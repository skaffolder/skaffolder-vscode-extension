import * as fs from "fs";
import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";
import * as yaml from "yaml";

export class DataService {
  private dataObj: SkaffolderObject;
  private fileObj: SkaffolderObject;

  constructor() {
    let data = fs.readFileSync(
      __dirname + "/../../src/services/dataExample.json",
      "utf-8"
    );
    this.dataObj = JSON.parse(data);

    let dataYaml = fs.readFileSync(
      __dirname + "/../../src/services/dataExampleOpenAPI3.yaml",
      "utf-8"
    );
    this.fileObj = yaml.parse(dataYaml);
  }

  public getSkObject() {
    return this.dataObj;
  }

  public getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }
}
