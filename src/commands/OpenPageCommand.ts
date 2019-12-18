import * as vscode from "vscode";
import { Page } from "../models/jsonreader/page";
import { DataService } from "../services/DataService";
import { Utils } from "../utils/Utils";

export class OpenPageCommand {
  static async command(
    confiFilePath: vscode.Uri,
    rangeModel: vscode.Range,
    page: Page
  ) {
    // Open file openapi
    try {
      await vscode.commands.executeCommand<vscode.Location[]>(
        "vscode.open",
        confiFilePath
      );
    } catch (e) {
      console.error(e);
    }

    // Select range
    let selection: vscode.Selection = new vscode.Selection(
      rangeModel.start,
      rangeModel.end
    );
    vscode.window.visibleTextEditors[0].selection = selection;
    vscode.window.visibleTextEditors[0].revealRange(rangeModel);

    // Open files
    let files = DataService.findRelatedFiles("module", page);

    Utils.openFiles(files);
  }
}
