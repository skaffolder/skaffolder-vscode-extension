import { YamlParser } from "../../utils/YamlParser";
import { SkaffolderObject } from "../SkaffolderObject";
export class Role {
  constructor(public _id: string, public name?: string) {}

  public description?: string;
}
