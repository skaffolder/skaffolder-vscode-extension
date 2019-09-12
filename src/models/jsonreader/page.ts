import { Range } from "vscode";
import { Role } from "./role";
import { Service } from "./service";

export class Page {
  constructor(public index: Range, yamlObj: any) {
    this._id = yamlObj["x-id"];
    this.name = yamlObj["x-name"];
    this.url = yamlObj["x-url"];
    this.template = yamlObj["x-template"];
    this._template_resource = yamlObj["x-resource"];
    this._services = yamlObj["x-services"];
    this._nesteds = yamlObj["x-nesteds"];
    this._links = yamlObj["x-links"];
  }
  public _id: string;
  public name: string;
  public _template_resource: string;
  public url: string;
  public template?: string;
  public description?: string;
  public html?: string;
  public _nesteds: Page[] | string[] = [];
  public _links: Page[] | string[] = [];
  public _roles?: Role[] | string[];
  public _services: Service[] | string[] = [];
}
