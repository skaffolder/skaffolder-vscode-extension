import { SkaffolderNode } from "../models/SkaffolderNode";
import * as SkaffolderCli from "skaffolder-cli";
import * as vscode from "vscode";
import { DataService } from "../services/DataService";
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
      const config = vscode.workspace.getConfiguration();
      const env: string = config.get("skaffolder.endpointDocs") || "https://docs.skaffolder.com";
      let url = `${env}/#!/${projectId}/models`;
      opn(url, {
        wait: false
      });
    }
  }
}
