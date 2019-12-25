import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";

// Commands import
import { OpenYamlCommand } from "../commands/OpenYamlCommand";
import { LoginCommand } from "../commands/LoginCommand";
import { ExportCommand } from "../commands/ExportCommand";
import { GenerateCommand } from "../commands/GenerateCommand";
import { CreateProjectCommand } from "../commands/CreateProjectCommand";
import { EditNodeCommand } from "../commands/EditNodeCommand";
import { OpenFilesCommand } from "../commands/OpenFilesCommand";
import { EditValueYamlCommand } from "../commands/EditValueYamlCommand";
import { CreatePageCommand } from "../commands/CreatePageCommand";
import { GoToSkaffolderCommand } from "../commands/GoToSkaffolderCommand";

export class Commands {
  static registerCommands(context: vscode.ExtensionContext) {
    // Set context
    EditNodeCommand.setContext(context);
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
    let createpageCmd = vscode.commands.registerCommand("skaffolder.createPage", CreatePageCommand.command);
    let goToSkaffolder = vscode.commands.registerCommand("skaffolder.goToSkaffolder", GoToSkaffolderCommand.command);
    let editNodeCmd = vscode.commands.registerCommand("skaffolder.editNode", EditNodeCommand.command);
    let openFileCmd = vscode.commands.registerCommand("skaffolder.openfiles", OpenFilesCommand.command);
    let openYamlCmd = vscode.commands.registerCommand("skaffolder.openyaml", OpenYamlCommand.command);
    let editYamlCmd = vscode.commands.registerCommand("skaffolder.editValue_yaml", EditValueYamlCommand.command);

    // Context subscription
    context.subscriptions.push(editNodeCmd);
    context.subscriptions.push(editYamlCmd);
    context.subscriptions.push(openFileCmd);
    context.subscriptions.push(openYamlCmd);
  }
}
