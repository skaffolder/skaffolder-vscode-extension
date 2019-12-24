import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { PageView } from "./views/PageView";

export class CreatePageCommand {
  static async command(contextNode: SkaffolderNode) {
    if (vscode.workspace.rootPath === undefined) {
      vscode.window.showInformationMessage("Please open a workspace!");
      return;
    }
    if (vscode.workspace.rootPath !== undefined) {
      Offline.pathWorkspace = vscode.workspace.rootPath;
    }
    //Ask name
    vscode.window
      .showInputBox({
        placeHolder: "Insert the name of your page"
      })
      .then(namePage => {
        if (namePage) {
          var page_yaml = {
            "x-skaffolder-name": namePage
          };
          let page = Offline.createPage(page_yaml);
          vscode.window.showInformationMessage("Page " + namePage + " created");
          let trees = refreshTree();

          // Open page view
          if (trees) {
            let pageNodes: any = trees.page.getChildren();
            for (let p in pageNodes) {
              let pageNode: SkaffolderNode = pageNodes[p];
              if (pageNode.params && pageNode.params.page && pageNode.params.page._id === page["x-skaffolder-id"]) {
                PageView.open(pageNode);
              }
            }
          }
        }
      });
  }
}
