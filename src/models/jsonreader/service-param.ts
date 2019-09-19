export class ServiceParam {
  constructor(objYaml: any) {
    this.name = objYaml.name;
    this.description = objYaml.description;
    this.type = objYaml["x-skaffolder-type"];
  }

  public _id?: string;
  public description?: string;
  public name?: string;
  public type?: string;
}
