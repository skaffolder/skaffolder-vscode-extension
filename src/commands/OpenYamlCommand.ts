import * as vscode from "vscode";
import { DataService } from "../services/DataService";

export class OpenYamlCommand {
  static async command(_id: string) {
    let configFilePath = vscode.Uri.file(vscode.workspace.rootPath + "/openapi.yaml");
    // Open file openapi
    try {
      // await vscode.commands.executeCommand<vscode.Location[]>("vscode.open", configFilePath);
      let docProm = vscode.workspace.openTextDocument(configFilePath);
      docProm.then(doc => {
        let tab = vscode.window.showTextDocument(doc, vscode.ViewColumn.Two);

        const docLines = DataService.getDataYaml().split(/[\n\r\u2028\u2029]+/g);
        const regex = new RegExp(`x-skaffolder-id:\\s*${_id}`);

        var range: vscode.Range;

        for (let index = 0; index < docLines.length; index++) {
          if (regex.test(docLines[index])) {
            range = new vscode.Range(index, 0, index, docLines[index].length);
            break;
          }
        }

        tab.then(tab => {
          if (range) {
            // Select range
            let selection: vscode.Selection = new vscode.Selection(range.start, range.end);
            tab.selection = selection;

            // Scroll to pos
            let posStart: vscode.Position = new vscode.Position(range.start.line - 1, 0);
            let posEnd: vscode.Position = new vscode.Position(range.end.line + 100, 0);
            let rangeScroll: vscode.Range = new vscode.Range(posStart, posEnd);
            tab.revealRange(rangeScroll);
          }
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
