import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";

export class EditValueYamlCommand {
  static async command(context: SkaffolderNode) {
    if (context.params && context.params.range) {
      // Open file openapi

      let contexturl = vscode.Uri.file(
        vscode.workspace.rootPath + "/openapi.yaml"
      );

      try {
        await vscode.commands.executeCommand<vscode.Location[]>(
          "vscode.open",
          contexturl
        );
      } catch (e) {
        console.error(e);
      }

      // Select range
      let selection: vscode.Selection = new vscode.Selection(
        context.params.range.start,
        context.params.range.end
      );
      vscode.window.visibleTextEditors[0].selection = selection;
      vscode.window.visibleTextEditors[0].revealRange(context.params.range);
    } else {
      console.error("Type node not provided");
    }
  }
}
