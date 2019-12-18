import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";
import { Resource } from "./jsonreader/resource";

/**
 *  Object model for SkaffolderObject data
 */
export class SkaffolderObject {
  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public dbs: Db[] = [];
  public modules: Page[] = [];

  public resource?: Resource;
}
