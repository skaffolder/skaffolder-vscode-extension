import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";

// ImportViews
import { DbView } from "./views/DbView";
import { ModelView } from "./views/ModelView";
import { ApiView } from "./views/ApiView";
import { PageView } from "./views/PageView";

export class EditNodeCommand {
  static context: vscode.ExtensionContext;

  static setContext(context: vscode.ExtensionContext) {
    EditNodeCommand.context = context;
  }

  static async command(contextNode: SkaffolderNode) {
    try {
      if (contextNode.params) {
        // Routing views
        if (contextNode.params.type === "db") {
          DbView.open(contextNode);
        } else if (contextNode.params.type === "resource") {
          ModelView.open(contextNode);
        } else if (contextNode.params.type === "service") {
          ApiView.open(contextNode);
        } else if (contextNode.params.type === "module") {
          PageView.open(contextNode);
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
