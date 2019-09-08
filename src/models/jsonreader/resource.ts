import { Entity } from "./entity";
import { Service } from "./service";
import { Range } from "vscode";

export class Resource {
  constructor(
    public index: Range,
    public _id: string,
    public name: string,
    public description?: string,
    public type?: string,
    public url?: string,
    public _services: Service[] = [],
    public _entity: Entity = new Entity(name)
  ) {}
}
