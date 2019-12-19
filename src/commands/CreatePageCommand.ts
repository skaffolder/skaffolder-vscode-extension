import { DataService } from "../services/DataService";
import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";
import * as fs from "fs";
import { Page } from "../models/jsonreader/page";

export class CreatePageCommand {

    static async command() {
        if (vscode.workspace.rootPath === undefined) {
          vscode.window.showInformationMessage("Please open a workspace!");
          return;
        }
        
        // //Ask name
        // vscode.window
        //     .showInputBox({
        //         placeHolder: "Insert the name of your page"
        //     }).then(namePage => {
        //         vscode.window.showInformationMessage("Start creation page");
        //         let yaml = DataService.getYaml();
        //         let skObj = DataService.getSkObject();
        //         console.log(JSON.stringify(DataService.getYaml()));
        //         SkaffolderCli.createPage(namePage);
        //         });

                
        //     vscode.window.showInformationMessage("Page create!");
            
    }
}