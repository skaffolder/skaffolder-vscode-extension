import * as vscode from "vscode";
import { DataService } from "../services/DataService";
import { SkaffolderObject } from "../models/SkaffolderObject";
import { SkaffolderTemplateNode } from "../models/SkaffolderTemplateNode";

export class TreeProviderTemplateSkaffolder
  implements vscode.TreeDataProvider<SkaffolderTemplateNode> {
  private templateList: any;

  constructor(private context: vscode.ExtensionContext) {
    // let dataDervice = new DataService();
    // this.templateList = dataDervice.getTemplateList();
  }

  getTreeItem(
    element: SkaffolderTemplateNode
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: SkaffolderTemplateNode | undefined
  ): vscode.ProviderResult<SkaffolderTemplateNode[]> {
    if (element) {
      return element.children;
    } else {
      let tree: SkaffolderTemplateNode = this.createTree();
      return tree.children;
    }
  }

  private createTree(): SkaffolderTemplateNode {
    let tree: SkaffolderTemplateNode;

    tree = new SkaffolderTemplateNode(this.context, "main");
    return tree;
  }
}
