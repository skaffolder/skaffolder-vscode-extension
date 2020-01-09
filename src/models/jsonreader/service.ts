import { Entity } from "./entity";
import { Resource } from "./resource";
import { Range } from "vscode";
import { Role } from "./role";
import { ServiceParam } from "./service-param";

export class Service {
  constructor(public index: Range | undefined, public method: string, objYaml: any) {
    this._id = objYaml["x-skaffolder-id"];
    this.name = objYaml["x-skaffolder-name"];

    this.crudAction = objYaml["x-skaffolder-crudAction"];
    this.crudType = objYaml["x-skaffolder-crudType"];
    this.description = objYaml["x-skaffolder-description"];
    this.returnDesc = objYaml["x-skaffolder-returnDesc"];
    this.returnType = objYaml["x-skaffolder-returnType"];
    this.url = objYaml["x-skaffolder-url"];
    this._resource = objYaml["x-skaffolder-id-resource"] || objYaml["x-skaffolder-resource"];

    // Parse roles
    if (objYaml["x-skaffolder-roles"]) {
      this._roles = [];
      for (let r in objYaml["x-skaffolder-roles"]) {
        this._roles.push(new Role(objYaml["x-skaffolder-roles"][r]));
      }
    }

    // Parse parameters
    for (let p in objYaml.parameters) {
      let param = objYaml.parameters[p];
      this._params.push(new ServiceParam(param));
    }
  }
  public _id: string;
  public name: string;
  public crudAction?: string;
  public crudType?: string;
  public description?: string;
  public returnDesc?: string;
  public returnType?: string;
  public url?: string;
  public _crudEntity?: Entity;
  public _resource?: Resource | string;
  public _roles?: Role[];
  public _params: ServiceParam[] = [];
}
