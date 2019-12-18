import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class PageNotFound {
  /**
   * Create node for empty page list
   */
  static execute(node: SkaffolderNode) {
    node.label = "No pages found";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
