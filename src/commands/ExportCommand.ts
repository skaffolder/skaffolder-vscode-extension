import { DataService } from "../services/DataService";
import * as vscode from "vscode";
import { isArray } from "util";

export class ExportCommand {
  static async command() {
    vscode.window.showInformationMessage("Export started");

    let params: any = DataService.readConfig();
    params.skObject = DataService.getYaml();
    DataService.exportProject(params, function(err: any, logs: any) {
      if (logs && logs === "Not authorized") {
        vscode.window.showWarningMessage("Login in Skaffolder required");
        vscode.commands.executeCommand<vscode.Location[]>("skaffolder.login");
        vscode.commands.executeCommand<vscode.Location[]>("skaffolder.export");
      } else {
        if (err) {
          vscode.window.showErrorMessage(err);
        }
        if (isArray(logs)) {
          logs.forEach(msg => {
            vscode.window.showInformationMessage(msg);
          });
        } else { vscode.window.showInformationMessage(logs); }
      }
    });
  }
}
