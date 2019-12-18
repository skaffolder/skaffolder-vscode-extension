import { SkaffolderNode } from "../models/SkaffolderNode";
import * as vscode from "vscode";
import * as webviewExt from "../test/webView";

export class EditValueCommand {
  static context: vscode.ExtensionContext;

  static setContext(context: vscode.ExtensionContext) {
    EditValueCommand.context = context;
  }

  static async command(contextNode: SkaffolderNode) {
    const panel = vscode.window.createWebviewPanel(
      "skaffolder",
      "Skaffolder Edit",
      vscode.ViewColumn.One,

      {
        enableScripts: true
      }
    );
    try {
      if (contextNode.params) {
        if (contextNode.params.type === "db") {
          panel.webview.html = new webviewExt.Webview().webView(
            EditValueCommand.context.extensionPath,
            "editDb"
          );

          //Message.Command EditDb
          panel.webview.onDidReceiveMessage(
            message => {
              switch (message.command) {
                case "save":
                  vscode.window.showInformationMessage("Save");
                  return;
                case "webview-ready":
                  panel.webview.postMessage({
                    command: "get-db",
                    data: JSON.stringify({
                      skObject: contextNode.params,
                      label: contextNode.label
                    })
                  });
                  break;
              }
            },
            undefined,
            EditValueCommand.context.subscriptions
          );
        } else if (
          contextNode.params.type === "resource" &&
          contextNode.contextValue === "model"
        ) {
          panel.webview.html = new webviewExt.Webview().webView(
            EditValueCommand.context.extensionPath,
            "editModel"
          );
          console.log(contextNode.params!.model!._entity);
          //Message.Command editModel
          panel.webview.onDidReceiveMessage(
            message => {
              switch (message.command) {
                case "save":
                  vscode.window.showInformationMessage("Save");
                  return;
                case "webview-ready":
                  panel.webview.postMessage({
                    command: "get-data",
                    data: JSON.stringify({
                      skObject: contextNode.params,
                      label: contextNode.label
                    })
                  });
                  break;
              }
            },
            undefined,
            EditValueCommand.context.subscriptions
          );
        } else if (contextNode.params.type === "resource") {
          panel.webview.html = new webviewExt.Webview().webView(
            EditValueCommand.context.extensionPath,
            "editApi"
          );

          //Message.Command editApi
          panel.webview.onDidReceiveMessage(
            message => {
              switch (message.command) {
                case "save":
                  vscode.window.showInformationMessage("Save");
                  return;
                case "webview-ready":
                  panel.webview.postMessage({
                    command: "get-service",
                    data: JSON.stringify({
                      service: contextNode.params!.model!._services.find(
                        (item: any) => {
                          return item.name === contextNode.label;
                        }
                      )
                    })
                  });
                  break;
              }
            },
            undefined,
            EditValueCommand.context.subscriptions
          );
        } else if (contextNode.params.type === "module") {
          panel.webview.html = new webviewExt.Webview().webView(
            EditValueCommand.context.extensionPath,
            "editPage"
          );

          //Message.Command editPage
          panel.webview.onDidReceiveMessage(
            message => {
              switch (message.command) {
                case "save":
                  vscode.window.showInformationMessage("Save");
                  return;
                case "webview-ready":
                  panel.webview.postMessage({
                    command: "get-page",
                    data: JSON.stringify({
                      page: contextNode.params!.page!,
                      label: contextNode.label,
                      api: contextNode.skaffolderObject.modules
                    })
                  });
                  break;
              }
            },
            undefined,
            EditValueCommand.context.subscriptions
          );
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
