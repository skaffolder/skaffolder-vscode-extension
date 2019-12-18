import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class ModelNotFound {
  /**
   * Create node for empty model list
   */
  static execute(node: SkaffolderNode) {
    node.label = "No models found";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
