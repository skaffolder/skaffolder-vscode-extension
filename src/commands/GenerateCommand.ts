import * as vscode from "vscode";

import * as path from "path";
import * as SkaffolderCli from "skaffolder-cli";
import { DataService } from "../services/DataService";
import * as fs from "fs";

export class GenerateCommand {
  static context: vscode.ExtensionContext;

  static setContext(context: vscode.ExtensionContext) {
    GenerateCommand.context = context;
  }

  static async command() {
    vscode.window.showInformationMessage("Generation starts");
    try {
      SkaffolderCli.generate(
        vscode.workspace.rootPath + "/",
        DataService.getSkObject(),
        {
          info: function(msg: string) {
            vscode.window.showInformationMessage(msg);
          }
        },
        async function(err: string[], logs: string[]) {
          vscode.window.showInformationMessage("Generation completed");

          // Print results in HTML
          const panel = vscode.window.createWebviewPanel(
            "skaffolder", // Identifies the type of the webview. Used internally
            "Skaffolder Generation Result", // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
              enableScripts: true
            }
          );

          const filePath: vscode.Uri = vscode.Uri.file(
            path.join(GenerateCommand.context.extensionPath, "public", "html", "reportGeneration.html")
          );
          const logoPath: string = vscode.Uri.file(
            path.join(GenerateCommand.context.extensionPath, "public", "img", "logo_white.svg")
          )
            .with({ scheme: "vscode-resource" })
            .toString();
          var html = fs.readFileSync(filePath.fsPath, "utf8");

          html += `
          <style>
           .logo {
              background-image: url("${logoPath}");
            };
          </style>`;
          html += logs.join("\n");
          panel.webview.html = html;
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
}
