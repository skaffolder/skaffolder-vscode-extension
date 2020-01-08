import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";
import { DataService } from "../services/DataService";
import { ReportGenerationView } from "./views/ReportGenerationView";
import { refreshTree } from "../extension";

export class GenerateCommand {
  static context: vscode.ExtensionContext;

  static setContext(context: vscode.ExtensionContext) {
    GenerateCommand.context = context;
  }

  static async command() {
    // Print results in HTML
    let view = new ReportGenerationView();
    view.open();

    try {
      // Start Generation
      const data = SkaffolderCli.getProjectData(
        {
          info: function(msg: string) {
            vscode.window.showInformationMessage(msg);
          }
        },
        vscode.workspace.rootPath + "/"
      );
      SkaffolderCli.generate(
        vscode.workspace.rootPath + "/",
        data,
        {
          info: function(msg: string) {
            vscode.window.showInformationMessage(msg);
          }
        },
        async function(err: string[], logs: string[]) {
          // Refresh Tree View
          refreshTree();

          // Callback
          let html = logs.join("\n");

          // Update page
          view.sendLogs(html);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
}
