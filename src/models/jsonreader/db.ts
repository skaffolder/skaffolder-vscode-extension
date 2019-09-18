import { Resource } from "./resource";
import { Entity } from "./entity";

export class Db {
  constructor(
    public _id: string,
    public name: string,
    public typeDb?: string,
    public _resources: Resource[] = [],
    public _entity: Entity[] = []
  ) {}
}
