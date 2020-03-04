/**
 * The module 'vscode' contains the VS Code extensibility API
 * Import the module and reference it with the alias vscode in your code below
 */
import * as vscode from "vscode";
import { TreeProviderSkaffolder } from "./providers/treeProviderSkaffolder";
import { DataService } from "./services/DataService";
import { Commands } from "./utils/Commands";
import { TreeProviderTemplateSkaffolder } from "./providers/treeProviderTemplateSkaffolder";
import { StatusBarManager } from "./utils/StatusBarManager";
import { Config } from "./utils/Config";
import SkaffolderCli = require("skaffolder-cli");
import { PageView } from "./commands/views/PageView";
import { SkaffolderNode } from "./models/SkaffolderNode";
import { ModelView } from "./commands/views/ModelView";
import { ApiView } from "./commands/views/ApiView";

let contextExtension: vscode.ExtensionContext;

/**
 *  This method is called when your extension is activated
 *  your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  console.clear();
  console.log('Congratulations, your extension "Skaffolder" is now active!');

  // Retrieve endpoint value
  SkaffolderCli.setEnv(Config.endpoint);

  vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);
  contextExtension = context;

  // Register commands
  Commands.registerCommands(contextExtension);

  // Load status bar
  StatusBarManager.init();

  // Check changes file

  vscode.workspace.onDidSaveTextDocument(e => {
    var filename = e.fileName
      .replace(/\//g, "")
      .replace(/\\/g, "")
      .replace((vscode.workspace.rootPath || "").replace(/\//g, "").replace(/\\/g, ""), "");

    if (filename === "openapi.yaml") {
      let trees = refreshTree();

      if (trees) {
        let pageView = PageView.instance,
          modelView = ModelView.instance,
          apiView = ApiView.instance;

        if (pageView && pageView.contextNode.params && pageView.contextNode.params.page) {
          let page_id = pageView.contextNode.params.page._id;
          let pageNodes = <SkaffolderNode[]>trees.page.getChildren();

          for (let p in pageNodes) {
            let pageNode = pageNodes[p];

            if (pageNode.params && pageNode.params.page && pageNode.params.page._id === page_id) {
              pageView.contextNode = pageNode;
              pageView.updatePanel(true);
            }
          }
        }

        let model;
        if (modelView && modelView.contextNode.params && modelView.contextNode.params.model) {
          model = modelView.contextNode.params.model;
        }

        let service;
        if (apiView && apiView.contextNode.params && apiView.contextNode.params.service) {
          service = apiView.contextNode.params.service;
        }
        let dbNodes = <SkaffolderNode[]>trees.model.getChildren();

        for (let db in dbNodes) {
          let dbNode = dbNodes[db];

          for (let m in dbNode.children) {
            let resNode = dbNode.children[m];

            if (model && modelView && resNode.params && resNode.params.model && resNode.params.model._id === model._id) {
              modelView.contextNode = resNode;
              modelView.updatePanel(true);
            }

            if (apiView && service) {
              for (let s in resNode.children) {
                let servNode = resNode.children[s];

                if (servNode.params && servNode.params.service && servNode.params.service._id === service._id) {
                  apiView.contextNode = servNode;
                  apiView.updatePanel(true);
                }
              }
            }
          }
        }
      }
    }
  });

  // Load interface
  try {
    refreshTree();
  } catch (e) {}
}

export function refreshTree() {
  DataService.refreshData();
  // Load interface
  vscode.window.showInformationMessage("Refresh");
  return refresh();
}

let refresh = function() {
  if (DataService.isSkaffolderProject()) {
    // Create trees
    const skaffolderProviderHeader = new TreeProviderTemplateSkaffolder(contextExtension, "header");

    // Register trees
    vscode.commands.executeCommand("setContext", "isSkaffolderProject", true);
    vscode.window.registerTreeDataProvider("skaffolderExplorerHeader", skaffolderProviderHeader);

    if (DataService.isYamlParsable()) {
      const skaffolderProviderModel = new TreeProviderSkaffolder(contextExtension, "model");
      const skaffolderProviderPage = new TreeProviderSkaffolder(contextExtension, "page");

      vscode.window.registerTreeDataProvider("skaffolderExplorerModel", skaffolderProviderModel);
      vscode.window.registerTreeDataProvider("skaffolderExplorerPage", skaffolderProviderPage);

      return {
        model: skaffolderProviderModel,
        page: skaffolderProviderPage
      };
    } else {
      const skaffolderProviderYaml = new TreeProviderTemplateSkaffolder(contextExtension, "yaml");
      vscode.window.registerTreeDataProvider("skaffolderExplorerYaml", skaffolderProviderYaml);
    }
  } else {
    // Create trees
    const skaffolderProviderTemplate = new TreeProviderTemplateSkaffolder(contextExtension, "main");

    // Register trees
    vscode.window.registerTreeDataProvider("skaffolderExplorerTemplates", skaffolderProviderTemplate);

    // Set context
    vscode.commands.executeCommand("setContext", "isSkaffolderProject", false);
  }
};

// This method is called when your extension is deactivated
export function deactivate() {}
