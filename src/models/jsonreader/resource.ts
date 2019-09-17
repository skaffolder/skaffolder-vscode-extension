import { Entity } from "./entity";
import { Service } from "./service";
import { Range } from "vscode";
import { Relation } from "./relation";

export class Resource {
  constructor(
    public index: Range | undefined,
    public _id: string,
    public name: string,
    public url: string,
    public description?: string,
    public type?: string,
    public _services: Service[] = [],
    public _entity: Entity | string = new Entity(name),
    public _relations: Relation[] = []
  ) {}
}
