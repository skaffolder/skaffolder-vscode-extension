import { Range } from "vscode";
import { Role } from "./role";
import { Service } from "./service";
import { Resource } from "./resource";

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

    let roles = yamlObj["x-roles"];

    // Populate roles
    if (roles instanceof Array) {
      this._roles = [];
      for (let r in roles) {
        let rol: Role = new Role(roles[r]);
        this._roles.push(rol);
      }
    }

    if (roles === undefined) {
      this._roles = undefined;
    }

    if (roles === null) {
      this._roles = [];
    }
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
  public _roles?: Role[] | null;
  public _services: Service[] | string[] = [];
  public _resources: Resource[] = [];
}
