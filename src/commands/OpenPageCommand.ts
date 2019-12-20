import * as vscode from "vscode";
import { Page } from "../models/jsonreader/page";
import { DataService } from "../services/DataService";
import { Utils } from "../utils/Utils";

export class OpenPageCommand {
  static async command(configFilePath: vscode.Uri, rangeModel: vscode.Range, page: Page) {
    // Open file openapi
    try {
      // await vscode.commands.executeCommand<vscode.Location[]>("vscode.open", configFilePath);
      let docProm = vscode.workspace.openTextDocument(configFilePath);
      docProm.then(doc => {
        let tab = vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
        tab.then(tab => {
          // Select range
          let selection: vscode.Selection = new vscode.Selection(rangeModel.start, rangeModel.end);
          tab.selection = selection;

          // Scroll to pos
          let posend: vscode.Position = new vscode.Position(rangeModel.end.line + 100, 0);
          let rangeScroll: vscode.Range = new vscode.Range(rangeModel.start, posend);
          tab.revealRange(rangeScroll);
        });
      });
    } catch (e) {
      console.error(e);
    }

    // Open files
    // let files = DataService.findRelatedFiles("module", page);
    // Utils.openFiles(files);
  }
}
