import { ResourceAttrEnum } from "./resource-attr-enum";
export class ResourceAttr {
  constructor(name: string, objOpenapi: any) {
    this.name = name;
    this._id = objOpenapi["x-skaffolder-id-attr"];
    this.type = objOpenapi["x-skaffolder-type"];
    this.required = objOpenapi["x-skaffolder-required"];
    this.unique = objOpenapi["x-skaffolder-unique"];
    this.description = objOpenapi["x-skaffolder-description"];

    if (objOpenapi["x-skaffolder-enumeration"]) {
      this._enum = [];
      for (var i in objOpenapi["x-skaffolder-enumeration"]) {
        this._enum.push(
          new ResourceAttrEnum(objOpenapi["x-skaffolder-enumeration"][i])
        );
      }
    }
  }
  public _id: string;
  public name: string;
  public type?: string;
  public required?: Boolean;
  public unique?: Boolean;
  public _enum?: ResourceAttrEnum[];
  public ref?: string;
  public description?: string;
}
