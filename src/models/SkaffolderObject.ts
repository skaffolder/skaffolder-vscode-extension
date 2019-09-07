import { Project } from "./jsonreader/project";
import { Db } from "./jsonreader/db";

export class SkaffolderObject {
  constructor() {}

  public project?: Project;
  public resources?: Db[];
}
