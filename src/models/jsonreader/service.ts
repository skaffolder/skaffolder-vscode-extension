import { Entity } from "./entity";
import { Resource } from "./resource";

export class Service {
  constructor(
    public method?: string,
    public name?: string,
    public _id?: string,
    public crudAction?: string,
    public crudType?: string,
    public description?: string,
    public returnDesc?: string,
    public returnType?: string,
    public url?: string,
    public _crudEntity?: Entity,
    public _resource?: Resource,
    public _roles?: string[]
  ) {}
}
