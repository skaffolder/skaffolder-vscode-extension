import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";
import { DataService } from "../services/DataService";

export class OpenYamlParseErrorCommand {
  static async command(context: SkaffolderNode) {
    let parseError = DataService.getYamlError();

    // Open yaml file

    let configFilePath = vscode.Uri.file(vscode.workspace.rootPath + "/openapi.yaml");
    // Open file openapi
    try {
      let docProm = vscode.workspace.openTextDocument(configFilePath);
      docProm.then(doc => {
        let tab = vscode.window.showTextDocument(doc, vscode.ViewColumn.One);

        var range: vscode.Range = new vscode.Range(
          parseError.source.rangeAsLinePos.start.line - 1,
          parseError.source.rangeAsLinePos.start.col - 1,
          parseError.source.rangeAsLinePos.end.line - 1,
          parseError.source.rangeAsLinePos.end.col - 1
        );
        tab.then(tab => {
          // Select range
          let selection: vscode.Selection = new vscode.Selection(range.start, range.end);
          tab.selection = selection;

          // Scroll to pos
          let posStart: vscode.Position = new vscode.Position(range.start.line - 1, 0);
          let posEnd: vscode.Position = new vscode.Position(range.end.line + 100, 0);
          let rangeScroll: vscode.Range = new vscode.Range(posStart, posEnd);
          tab.revealRange(rangeScroll);
        });
      });
      return parseError;
    } catch (e) {
      console.error(e);
      return parseError;
    }
  }
}
