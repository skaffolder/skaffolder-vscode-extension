import * as vscode from "vscode";
import { SkaffolderTemplateNode } from "../models/SkaffolderTemplateNode";

/**
 * This is a TreeDataProvider implementation when the current folder is not a Skaffolder project folder
 */
export class TreeProviderTemplateSkaffolder implements vscode.TreeDataProvider<SkaffolderTemplateNode> {
  private templateList: any;

  constructor(private context: vscode.ExtensionContext, private type: string) {}

  getTreeItem(element: SkaffolderTemplateNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: SkaffolderTemplateNode | undefined): vscode.ProviderResult<SkaffolderTemplateNode[]> {
    if (element) {
      return element.children;
    } else {
      let tree: SkaffolderTemplateNode = this.createTree();
      return tree.children;
    }
  }

  private createTree(): SkaffolderTemplateNode {
    let tree: SkaffolderTemplateNode;
    tree = new SkaffolderTemplateNode(this.context, this.type);
    return tree;
  }
}
