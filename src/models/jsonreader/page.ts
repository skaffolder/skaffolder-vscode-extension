import { Range } from "vscode";

export class Page {
  constructor(
    public index: Range,
    public _id: string,
    public name: string,
    public url?: string,
    public template?: string,
    public description?: string,
    public html?: string
  ) {}
}
