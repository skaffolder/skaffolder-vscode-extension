import { Entity } from "./entity";

export class Resource {
  constructor() {}

  public _id?: string;
  public description?: string;
  public name?: string;
  public type?: string;
  public url?: string;
  // Relations _entity
  public _resource?: Entity[];
}
