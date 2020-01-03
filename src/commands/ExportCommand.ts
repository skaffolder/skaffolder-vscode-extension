import { DataService } from "../services/DataService";
import * as vscode from "vscode";
import { ExportView } from "./views/ExportView";

export class ExportCommand {
  static async command() {
    vscode.window.showInformationMessage("Export started");

    let params: any = DataService.readConfig();
    params.skObject = DataService.getYaml();
    params.outputHtml = true;
    params.workspacePath = vscode.workspace.rootPath + "/";

    try {
      DataService.exportProject(params, function(err: any, logs: any) {
        if (err || (logs && logs === "Not authorized")) {
          if (err && err !== "You should login with the command: 'sk login'") {
            vscode.window.showWarningMessage(err);
          } else {
            vscode.window.showWarningMessage("Login in Skaffolder required");
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.login", (err: any, user: string) => {
              // Retry
              vscode.commands.executeCommand<vscode.Location[]>("skaffolder.export");
            });
          }
        } else {
          if (err) {
            vscode.window.showErrorMessage(err);
          }
          ExportView.open(logs);
          DataService.refreshData();
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
