import * as vscode from "vscode";
import { DataService } from "../services/DataService";
import { SkaffolderObject } from "../models/SkaffolderObject";
import { SkaffolderNode } from "../models/SkaffolderNode";

/**
 * This is a TreeDataProvider implementation
 */
export class TreeProviderSkaffolder implements vscode.TreeDataProvider<SkaffolderNode> {
  private skObject: SkaffolderObject;

  constructor(private context: vscode.ExtensionContext, private type: string) {
    try {
      this.skObject = DataService.getSkObject();
    } catch (e) {
      this.skObject = new SkaffolderObject();
    }
  }

  getTreeItem(element: SkaffolderNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: SkaffolderNode | undefined): vscode.ProviderResult<SkaffolderNode[]> {
    if (element) {
      return element.children;
    } else {
      let tree: SkaffolderNode = this.createTree();
      return tree.children;
    }
  }

  private createTree(): SkaffolderNode {
    let tree: SkaffolderNode;

    tree = new SkaffolderNode(this.context, this.skObject, this.type, []);
    return tree;
  }
}
