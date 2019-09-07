import { Entity } from "./entity";
import { Service } from "./service";

export class Resource {
  constructor() {}

  public _id?: string;
  public description?: string;
  public name?: string;
  public type?: string;
  public url?: string;
  public _services: Service[] = [];
}
