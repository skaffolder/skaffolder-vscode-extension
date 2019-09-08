import { ResourceAttr } from "./resource-attr";
import { Relation } from "./relation";
export class Entity {
  constructor(
    public name?: string,
    public _id?: string,
    public description?: string,
    public type?: string,

    public _attrs: ResourceAttr[] = [],
    public _relations: Relation[] = []
  ) {}
}
