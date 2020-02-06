import * as vscode from "vscode";
import { Webview } from "../../utils/WebView";
import { EditNodeCommand } from "../EditNodeCommand";
import { SkaffolderNode } from "../../models/SkaffolderNode";
import { SkaffolderView } from "./SkaffolderView";

export class DbView extends SkaffolderView {
  static async open(contextNode: SkaffolderNode) {
    if (!DbView.instance) {
      DbView.instance = new DbView(contextNode);
    } else {
      DbView.instance.contextNode = contextNode;
    }

    await DbView.instance.updatePanel();
  }

  public registerOnDisposePanel(): void {
    this.panel.onDidDispose((e) => {
      DbView.instance = undefined;
    });
  }

  public getTitle(): string {
    return `SK Database - ${this.contextNode.label}`;
  }

  public getYamlID(): string | undefined {
    if (this.contextNode.params && this.contextNode.params.db) {
      return this.contextNode.params.db._id;
    }
  }

  public registerPanelListeners() {
    this.panel.webview.html = Webview.serve("editDb");

    // Message.Command editDb
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "save":
            vscode.window.showInformationMessage("Save");
            return;
          case "openFiles":
            this.panel.webview.postMessage({
              command: "openFiles"
            });
            // Execute Command
            vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openfiles", contextNode);
            break;
          case "getDb":
            this.panel.webview.postMessage({
              command: "getDb",
              data: this.contextNode.params ? this.contextNode.params.db : null
            });
            break;
        }
      },
      undefined,
      EditNodeCommand.context.subscriptions
    );
  }
}
