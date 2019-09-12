import * as vscode from "vscode";
import * as path from "path";

export class SkaffolderTemplateNode extends vscode.TreeItem {
  public children: SkaffolderTemplateNode[] = [];

  constructor(private context: vscode.ExtensionContext, type: string) {
    super("", vscode.TreeItemCollapsibleState.None);

    if (type === "main") {
      this.label = "Skaffolder";

      this.children.push(new SkaffolderTemplateNode(context, "label"));
      this.children.push(new SkaffolderTemplateNode(context, "label2"));
      this.children.push(new SkaffolderTemplateNode(context, "createButton"));
    } else if (type === "label") {
      this.label = "Welcome in Skaffolder";
    } else if (type === "label2") {
      this.description = "Workspace has no openapi.yaml";
    } else if (type === "createButton") {
      this.label = "Create projects";
      this.iconPath = {
        light: this.context.asAbsolutePath(
          path.join("media", "light", "plus.svg")
        ),
        dark: this.context.asAbsolutePath(
          path.join("media", "dark", "plus.svg")
        )
      };
      this.command = {
        command: "skaffolder.createProject",
        title: "Create project",
        arguments: []
      };
    }
  }
}
