import { Range } from "vscode";
import { Role } from "./role";
import { Service } from "./service";
import { Resource } from "./resource";

export class Page {
  constructor(public index: Range | undefined, yamlObj: any) {
    this._id = yamlObj["x-skaffolder-id"];
    this.name = yamlObj["x-skaffolder-name"];
    this.url = yamlObj["x-skaffolder-url"];
    this.template = yamlObj["x-skaffolder-template"];
    this._template_resource = yamlObj["x-skaffolder-resource"];
    this._services = yamlObj["x-skaffolder-services"];
    this._nesteds = yamlObj["x-skaffolder-nesteds"];
    this._links = yamlObj["x-skaffolder-links"];

    let roles = yamlObj["x-skaffolder-roles"];

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
