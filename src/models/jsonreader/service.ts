import { Entity } from "./entity";
import { Resource } from "./resource";
import { Range } from "vscode";

export class Service {
  constructor(
    public index: Range,
    public _id: string,
    public name: string,
    public method: string,
    public crudAction?: string,
    public crudType?: string,
    public description?: string,
    public returnDesc?: string,
    public returnType?: string,
    public url?: string,
    public _crudEntity?: Entity,
    public _resource?: Resource,
    public _roles?: string[]
  ) {}
}
