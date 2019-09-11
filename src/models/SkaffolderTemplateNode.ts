import * as vscode from "vscode";
import * as path from "path";

export class SkaffolderTemplateNode extends vscode.TreeItem {
  public children: SkaffolderTemplateNode[] = [];

  constructor(private context: vscode.ExtensionContext) {
    super("Test", vscode.TreeItemCollapsibleState.None);
  }
}
