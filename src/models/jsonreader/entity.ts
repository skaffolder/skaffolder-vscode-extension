import { ResourceAttr } from "./resource-attr";
import { Relation } from "./relation";
export class Entity {
  constructor() {}

  public _id?: string;
  public description?: string;
  public name?: string;
  public type?: string;
  public attributes?: ResourceAttr[];
  public relations?: Relation[];
}
