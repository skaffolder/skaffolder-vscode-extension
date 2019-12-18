import * as vscode from "vscode";
import { Db } from "../models/jsonreader/db";
import { Resource } from "../models/jsonreader/resource";
import { DataService } from "../services/DataService";
import { Utils } from "../utils/Utils";

export class OpenApiCommand {
  static async command(
    confiFilePath: vscode.Uri,
    rangeModel: vscode.Range,
    model: Resource,
    db: Db
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
    let files = DataService.findRelatedFiles("resource", model, db);

    Utils.openFiles(files);
  }
}
