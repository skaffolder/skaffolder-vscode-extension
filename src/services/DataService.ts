import * as fs from "fs";
import { SkaffolderObject } from "../models/skaffolderObject";
import { Db } from "../models/jsonreader/db";

export class DataService {
  private dataObj: SkaffolderObject;

  constructor() {
    console.log("init data service api");
    let data = fs.readFileSync(
      __dirname + "/../../src/services/dataExample.json",
      "utf-8"
    );
    this.dataObj = JSON.parse(data);
  }

  public getSkObject() {
    return this.dataObj;
  }

  public getApi(): Db[] {
    let obj = this.getSkObject();

    return obj["resources"] || [];
  }
}
