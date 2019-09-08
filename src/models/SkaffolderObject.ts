import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { Resource } from "./jsonreader/resource";
import { ResourceAttr } from "./jsonreader/resource-attr";
import { Service } from "./jsonreader/service";
import * as vscode from "vscode";
import * as yaml from "yaml";

export class SkaffolderObject {
  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public modules: Page[] = [];
}
