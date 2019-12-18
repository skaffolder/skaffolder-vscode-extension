import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";

// Commands import
import { OpenPageCommand } from "../commands/OpenPageCommand";
import { LoginCommand } from "../commands/LoginCommand";
import { ExportCommand } from "../commands/ExportCommand";
import { GenerateCommand } from "../commands/GenerateCommand";
import { CreateProjectCommand } from "../commands/CreateProjectCommand";
import { EditValueCommand } from "../commands/EditValueCommand";
import { OpenFilesCommand } from "../commands/OpenFilesCommand";
import { OpenApiCommand } from "../commands/OpenApiCommand";
import { EditValueYamlCommand } from "../commands/EditValueYamlCommand";

export class Commands {
  static registerCommands(context: vscode.ExtensionContext) {
    // Register commands
    GenerateCommand.setContext(context);
    vscode.commands.registerCommand("skaffolder.login", LoginCommand.command);
    vscode.commands.registerCommand("skaffolder.export", ExportCommand.command);
    vscode.commands.registerCommand(
      "skaffolder.generate",
      GenerateCommand.command
    );

    // Create project
    try {
      // Get list templates
      SkaffolderCli.getTemplate((err: any, template: any[]) => {
        CreateProjectCommand.setTemplate(template);
        vscode.commands.registerCommand(
          "skaffolder.createProject",
          CreateProjectCommand.command
        );
      });
    } catch (e) {
      console.error(e);
    }

    // Edit model
    EditValueCommand.setContext(context);
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.editValue",
        EditValueCommand.command
      )
    );

    // Edit model
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.editValue_yaml",
        EditValueYamlCommand.command
      )
    );

    // Open files
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openfiles",
        OpenFilesCommand.command
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openapi",
        OpenApiCommand.command
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openpage",
        OpenPageCommand.command
      )
    );
  }
}
