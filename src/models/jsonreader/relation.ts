import { Entity } from "./entity";

export class Relation {
  constructor() {}

  public _id?: string;
  public name?: string;
  public required?: Boolean;
  public type?: string;
  public _ent1?: Entity;
  public _ent2?: Entity;
}
