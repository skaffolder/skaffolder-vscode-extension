import { DataService } from "../services/DataService";
import * as vscode from "vscode";
import * as SkaffolderCli from "skaffolder-cli";
import * as fs from "fs";
import { refreshTree } from "../extension";

export class CreateProjectCommand {
  static template: any[];

  static setTemplate(template: any[]) {
    CreateProjectCommand.template = template;
  }

  static async command() {
    if (vscode.workspace.rootPath === undefined) {
      vscode.window.showInformationMessage("Please open a workspace!");
      return;
    }
    let listFrontend: any[] = [];
    let listBackend: any[] = [];

    CreateProjectCommand.template.filter(temp => {
      if (temp.type === "frontend") {
        listFrontend.push({
          label: temp.name,
          context: temp._id
        });
      } else if (temp.type === "backend") {
        listBackend.push({
          label: temp.name,
          context: temp._id
        });
      }
    });
    // Ask name
    vscode.window
      .showInputBox({
        placeHolder: "Insert the name of your project"
      })
      .then(nameProj => {
        // Ask backend
        vscode.window
          .showQuickPick(listFrontend, {
            placeHolder: "Choose your frontend language"
          })
          .then(frontendObj => {
            vscode.window
              .showQuickPick(listBackend, {
                placeHolder: "Choose your backend language"
              })
              .then(async backendObj => {
                vscode.window.showInformationMessage("Start creation project!");
                // Create metadata
                let skObj = DataService.createSkObj(nameProj as string);

                // Create project
                SkaffolderCli.createProjectExtension(
                  vscode.workspace.rootPath + "/",
                  "",
                  {
                    info: function(msg: string) {
                      // vscode.window.showInformationMessage(msg);
                    }
                  },
                  frontendObj,
                  backendObj,
                  skObj,
                  function(skObj) {
                    // Init CLI
                    SkaffolderCli.init(
                      vscode.workspace.rootPath + "/",
                      skObj.project,
                      skObj.modules,
                      skObj.resource,
                      skObj.dbs,
                      skObj.roles
                    );
                    let content = fs.readFileSync(
                      (vscode.workspace.rootPath + "/.skaffolder/template/openapi.yaml.hbs") as string,
                      "utf-8"
                    );
                    let file = SkaffolderCli.getProperties(content, "openapi.yaml.hbs", "/.skaffolder/template/");

                    // Generate Openapi YAML
                    SkaffolderCli.generateFile(
                      [],
                      {
                        name: "openapi.yaml",
                        overwrite: file.overwrite,
                        template: file.template
                      },
                      skObj,
                      {}
                    );

                    // Refresh Tree View
                    refreshTree();
                  }
                );
              });
          });
      });
  }
}
