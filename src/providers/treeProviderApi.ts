import * as vscode from "vscode";
import { DataService } from "../services/DataService";
import { SkaffolderObject } from "../models/SkaffolderObject";
import { Db } from "../models/jsonreader/db";

export class TreeProviderApi implements vscode.TreeDataProvider<number> {
  private skObject: Db[];

  constructor(data: vscode.ExtensionContext) {
    console.log("init provider api");
    let dataDervice = new DataService();
    this.skObject = dataDervice.getApi();
  }

  getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
    let myItem: vscode.TreeItem = new vscode.TreeItem(
      this.skObject[element - 1].name,
      vscode.TreeItemCollapsibleState.None
    );
    return myItem;
  }

  getChildren(element?: number | undefined): vscode.ProviderResult<number[]> {
    console.log("Get children ");
    const offsets: number[] = this.skObject.map((item, count) => {
      return count + 1;
    });
    console.log(offsets);

    return offsets;
  }
}
