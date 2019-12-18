import * as vscode from "vscode";
import { SkaffolderNode } from "../SkaffolderNode";

export class PageNotFound {
  static execute(node: SkaffolderNode) {
    node.label = "No pages found";
    node.contextValue = "empty";
    node.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}
