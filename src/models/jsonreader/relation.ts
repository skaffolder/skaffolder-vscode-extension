import { Entity } from "./entity";

export class Relation {
  constructor(name: string, objOpenapi: any) {
    this._id = objOpenapi["x-skaffolder-id"];
    this.name = name;
    this.required = objOpenapi["x-skaffolder-required"];
    this.type = objOpenapi["x-skaffolder-type"];
    this._ent1 = objOpenapi["x-skaffolder-ent1"];
    this._ent2 = objOpenapi["x-skaffolder-ent2"];
  }

  public _id?: string;
  public name?: string;
  public required?: Boolean;
  public type?: string;
  public _ent1?: Entity | string;
  public _ent2?: Entity | string;
}
