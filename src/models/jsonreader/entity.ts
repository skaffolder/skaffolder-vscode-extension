import { ResourceAttr } from "./resource-attr";
import { Relation } from "./relation";
import { Resource } from "./resource";
export class Entity {
  constructor(
    public name?: string,
    public _id?: string,
    public _db?: string,
    resource?: Resource,
    public description?: string,
    public type?: string,

    public _attrs: ResourceAttr[] = [],
    public _relations: Relation[] = [],
    public _resource?: Resource
  ) {
    if (resource) {
      // resource._entity = "";
      this._resource = new Resource(
        undefined,
        resource._id,
        resource.name,
        resource.url,
        resource._db
      );
    }
  }
}
