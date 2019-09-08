import { ResourceAttrEnum } from "./resource-attr-enum";
export class ResourceAttr {
  constructor(
    public _id?: string,
    public name?: string,
    public type?: string,
    public required?: Boolean,
    public unique?: Boolean,
    public enums?: ResourceAttrEnum[],
    public ref?: string,
    public description?: string
  ) {}
}
