import { Resource } from "./resource";

export class Db {
  constructor(
    public _id?: string,
    public name?: string,
    public typeDb?: string,
    public _resources: Resource[] = []
  ) {}
}
