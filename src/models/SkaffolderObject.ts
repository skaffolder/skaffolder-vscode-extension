import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";
import { Page } from "./jsonreader/page";

export class SkaffolderObject {
  constructor() {}

  public project?: Project;
  public resources: Db[] = [];
  public modules: Page[] = [];
}
