import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";
import { DataService } from "../services/DataService";
import { Config } from "../utils/Config";
const opn = require("opn");

export class GoToSkaffolderDocCommand {
  static async command(context: SkaffolderNode) {
    let yaml: any = DataService.getYaml();
    let projectId = yaml && yaml["info"] ? yaml["info"]["x-skaffolder-id-project"] : null;

    if (!projectId) {
      // Ask for export
      vscode.window
        .showQuickPick(
          [
            { label: "Ok, export the openapi.yaml file to Skaffolder", value: 1 },
            { label: "Cancel", value: 0 }
          ],
          {
            placeHolder: "To access your Skaffolder web dashboard you should export the project"
          }
        )
        .then(response => {
          if (response && response.value === 1) {
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.export");
          }
        });
    } else {
      // Open browser
      let url = `${Config.endpointDocs}/#!/${projectId}/models`;
      opn(url, {
        wait: false
      });
    }
  }
}
