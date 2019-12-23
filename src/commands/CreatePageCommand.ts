
import * as vscode from "vscode";
import { Offline } from "skaffolder-cli";
import { refreshTree } from "../extension";
import {SkaffolderNode} from "../models/SkaffolderNode";
import { PageView } from "./views/PageView";
import { Page } from "../models/jsonreader/page";

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
            }).then(namePage => {
                vscode.window.showInformationMessage("Start creation page");
                var page_yaml = {
                  "x-skaffolder-name": namePage,
                };
                Offline.createPage(page_yaml);
                vscode.window.showInformationMessage("Page " + namePage + " created");
                vscode.window.showInformationMessage("Now edit your page!");
                refreshTree();
                });
    }
}