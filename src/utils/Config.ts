import * as vscode from "vscode";

export class Config {
  static config = vscode.workspace.getConfiguration();

  static endpoint: string = Config.config.get("skaffolder.endpoint") || "https://app.skaffolder.com";
  static endpointDocs: string = Config.config.get("skaffolder.endpointDocs") || "https://docs.skaffolder.com";
}
