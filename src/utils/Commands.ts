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
    // Set context
    EditValueCommand.setContext(context);
    GenerateCommand.setContext(context);
    try {
      // Get list templates
      SkaffolderCli.getTemplate((err: any, template: any[]) => {
        CreateProjectCommand.setTemplate(template);
      });
    } catch (e) {
      console.error(e);
    }

    // Register commands
    let loginCmd = vscode.commands.registerCommand("skaffolder.login", LoginCommand.command);
    let exportCmd = vscode.commands.registerCommand("skaffolder.export", ExportCommand.command);
    let genCmd = vscode.commands.registerCommand("skaffolder.generate", GenerateCommand.command);
    let createCmd = vscode.commands.registerCommand("skaffolder.createProject", CreateProjectCommand.command);
    let editCmd = vscode.commands.registerCommand("skaffolder.editValue", EditValueCommand.command);
    let openFileCmd = vscode.commands.registerCommand("skaffolder.openfiles", OpenFilesCommand.command);
    let openApiCmd = vscode.commands.registerCommand("skaffolder.openapi", OpenApiCommand.command);
    let openPageCmd = vscode.commands.registerCommand("skaffolder.openpage", OpenPageCommand.command);
    let editYamlCmd = vscode.commands.registerCommand("skaffolder.editValue_yaml", EditValueYamlCommand.command);

    // Context subscription
    context.subscriptions.push(editCmd);
    context.subscriptions.push(editYamlCmd);
    context.subscriptions.push(openFileCmd);
    context.subscriptions.push(openApiCmd);
    context.subscriptions.push(openPageCmd);
  }
}
