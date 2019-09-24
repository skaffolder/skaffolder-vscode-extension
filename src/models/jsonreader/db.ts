import { Resource } from "./resource";
import { Entity } from "./entity";
import * as vscode from "vscode";

export class Db {
  constructor(
    public _id: string,
    public name: string,
    public index?: vscode.Range,
    public typeDb?: string,
    public _resources: Resource[] = [],
    public _entity: Entity[] = []
  ) {}
}
