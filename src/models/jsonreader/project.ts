export class Project {
  constructor(obj: Project) {
    this._id = obj._id;
    this.name = obj.name;
  }

  public _id: string;
  public name: string;
}
