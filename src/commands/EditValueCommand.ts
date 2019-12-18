import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";

// ImportViews
import { DbView } from "./views/DbView";
import { ModelView } from "./views/ModelView";
import { ApiView } from "./views/ApiView";
import { ModuleView } from "./views/ModuleView";

export class EditValueCommand {
  static context: vscode.ExtensionContext;

  static setContext(context: vscode.ExtensionContext) {
    EditValueCommand.context = context;
  }

  static async command(contextNode: SkaffolderNode) {
    const panel = vscode.window.createWebviewPanel("skaffolder", "Skaffolder Edit", vscode.ViewColumn.One, {
      enableScripts: true
    });

    try {
      if (contextNode.params) {
        // Routing views
        if (contextNode.params.type === "db") {
          DbView.open(contextNode, panel);
        } else if (contextNode.params.type === "resource" && contextNode.contextValue === "model") {
          ModelView.open(contextNode, panel);
        } else if (contextNode.params.type === "resource") {
          ApiView.open(contextNode, panel);
        } else if (contextNode.params.type === "module") {
          ModuleView.open(contextNode, panel);
        } else {
          console.error("Type " + contextNode.params.type + " not valid");
        }
      } else {
        console.error("Type node not provided");
      }
    } catch (e) {
      console.error(e);
    }
  }
}
