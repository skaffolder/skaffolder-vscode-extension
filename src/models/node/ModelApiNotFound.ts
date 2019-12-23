import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class ModelApiNotFound {
  /**
   * Create node for models without APIs
   */
  static execute(node: SkaffolderNode) {
    node.label = "No APIs in this model";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
