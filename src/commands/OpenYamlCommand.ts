import * as vscode from "vscode";

export class OpenYamlCommand {
  static async command(rangeModel: vscode.Range) {
    let configFilePath = vscode.Uri.file(vscode.workspace.rootPath + "/openapi.yaml");
    // Open file openapi
    try {
      // await vscode.commands.executeCommand<vscode.Location[]>("vscode.open", configFilePath);
      let docProm = vscode.workspace.openTextDocument(configFilePath);
      docProm.then(doc => {
        let tab = vscode.window.showTextDocument(doc, vscode.ViewColumn.Two);
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
