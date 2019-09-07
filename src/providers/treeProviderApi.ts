import * as vscode from "vscode";
import { DataService } from "../services/DataService";
import { SkaffolderObject } from "../models/SkaffolderObject";
import { Db } from "../models/jsonreader/db";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { createWriteStream } from "fs";

export class TreeProviderApi
  implements vscode.TreeDataProvider<SkaffolderNode> {
  private skObject: SkaffolderObject;

  constructor(data: vscode.ExtensionContext) {
    console.log("init provider api");
    let dataDervice = new DataService();
    this.skObject = dataDervice.getSkObject();
  }

  getTreeItem(
    element: SkaffolderNode
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: SkaffolderNode | undefined
  ): vscode.ProviderResult<SkaffolderNode[]> {
    if (element) {
      return element.children;
    } else {
      let tree: SkaffolderNode = this.createTree();
      return tree.children;
    }
  }

  private createTree(): SkaffolderNode {
    let tree: SkaffolderNode;

    tree = new SkaffolderNode(this.skObject, "api", []);
    return tree;
  }
}
