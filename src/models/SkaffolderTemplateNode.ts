import * as vscode from "vscode";
import * as path from "path";
import SkaffolderCli = require("skaffolder-cli");
import { DataService } from "../services/DataService";

/**
 * Tree interface for not Skaffolder project folder
 */
export class SkaffolderTemplateNode extends vscode.TreeItem {
  public children: SkaffolderTemplateNode[] = [];

  constructor(private context: vscode.ExtensionContext, type: string) {
    super("", vscode.TreeItemCollapsibleState.None);

    // Not a Skaffolder project tree
    if (type === "main") {
      this.label = "Skaffolder";
      this.children.push(new SkaffolderTemplateNode(context, "label"));
      this.children.push(new SkaffolderTemplateNode(context, "label2"));
      this.children.push(new SkaffolderTemplateNode(context, "createButton"));
    } else if (type === "label") {
      this.label = "Welcome in Skaffolder";
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "logo.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "logo.svg"))
      };
    } else if (type === "label2") {
      this.description = "Workspace has no openapi.yaml";
    } else if (type === "createButton") {
      this.label = "Create projects";
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "add.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "add.svg"))
      };
      this.command = {
        command: "skaffolder.createProject",
        title: "Create project",
        arguments: []
      };
    }
    // Header tree
    else if (type === "header") {
      this.label = "Welcome in Skaffolder";
      this.children.push(new SkaffolderTemplateNode(context, "generate"));
      this.children.push(new SkaffolderTemplateNode(context, "export"));
      this.children.push(new SkaffolderTemplateNode(context, "skaffolder"));
      this.children.push(new SkaffolderTemplateNode(context, "skaffolderDoc"));
      this.children.push(new SkaffolderTemplateNode(context, "user"));
    } else if (type === "generate") {
      this.label = "Generate Code";
      this.contextValue = "empty";
      this.command = {
        command: "skaffolder.generate",
        title: "Generate Code"
      };
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "code.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "code.svg"))
      };
    } else if (type === "export") {
      this.label = "Export project";
      this.contextValue = "empty";
      this.command = {
        command: "skaffolder.export",
        title: "Export project"
      };
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "link-external.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "link-external.svg"))
      };
    } else if (type === "skaffolder") {
      this.label = "Go To Skaffolder";
      this.contextValue = "empty";
      this.command = {
        command: "skaffolder.goToSkaffolder",
        title: "Go To Skaffolder"
      };
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "logo.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "logo.svg"))
      };
    } else if (type === "skaffolderDoc") {
      this.label = "Open online Documentation";
      this.contextValue = "empty";
      this.command = {
        command: "skaffolder.goToSkaffolderDoc",
        title: "Open online Documentation"
      };
      this.iconPath = {
        light: this.context.asAbsolutePath(path.join("media", "light", "book.svg")),
        dark: this.context.asAbsolutePath(path.join("media", "dark", "book.svg"))
      };
    } else if (type === "user") {
      let user: string | undefined = SkaffolderCli.getUser();
      if (user) {
        this.label = "Logout user: " + user;
        this.contextValue = "empty";
        this.command = {
          command: "skaffolder.logout",
          title: "Logout"
        };
        this.iconPath = {
          light: this.context.asAbsolutePath(path.join("media", "light", "logout.svg")),
          dark: this.context.asAbsolutePath(path.join("media", "dark", "logout.svg"))
        };
      } else {
        this.label = "Login";
        this.contextValue = "empty";
        this.command = {
          command: "skaffolder.login",
          title: "Login Skaffolder"
        };
        this.iconPath = {
          light: this.context.asAbsolutePath(path.join("media", "light", "login.svg")),
          dark: this.context.asAbsolutePath(path.join("media", "dark", "login.svg"))
        };
      }
    }

    // Not a Skaffolder project tree
    else if (type === "yaml") {
      this.label = "Skaffolder";
      this.children.push(new SkaffolderTemplateNode(context, "yamlMsg"));
      this.children.push(new SkaffolderTemplateNode(context, "yamlErrorMsg"));
      this.children.push(new SkaffolderTemplateNode(context, "yamlLine"));
    } else if (type === "yamlMsg") {
      this.label = "YAML parse error";
      this.command = {
        command: "skaffolder.openYamlParseError",
        title: "Open Yaml Parse Error"
      };
    } else if (type === "yamlErrorMsg") {
      let errorYamlLabel = "";
      try {
        errorYamlLabel = DataService.getYamlError().message;
      } catch (e) {}
      this.label = errorYamlLabel;
      this.command = {
        command: "skaffolder.openYamlParseError",
        title: "Open Yaml Parse Error"
      };
    } else if (type === "yamlLine") {
      let errorYamlLabel = "";
      try {
        let parseError = DataService.getYamlError();
        errorYamlLabel =
          "line: " + parseError.source.rangeAsLinePos.start.line + ", col " + parseError.source.rangeAsLinePos.start.col;

        this.command = {
          command: "skaffolder.openYamlParseError",
          title: "Open Yaml Parse Error"
        };
      } catch (e) {}
      this.label = errorYamlLabel;
    }
  }
}
