import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class PageApiNotFound {
  /**
   * Create node for empty page list
   */
  static execute(node: SkaffolderNode) {
    node.label = "No APIs in this page";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
