import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class ModelNotFound {
  static execute(node: SkaffolderNode) {
    node.label = "No models found";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
