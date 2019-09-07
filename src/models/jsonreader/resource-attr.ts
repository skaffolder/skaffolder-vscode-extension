import { ResourceAttrEnum } from "./resource-attr-enum";
export class ResourceAttr {
  constructor() {}

  public _id?: string;
  public description?: string;
  public name?: string;
  public ref?: string;
  public required?: Boolean;
  public type?: string;
  public unique?: Boolean;
  public enums?: ResourceAttrEnum[];
}
