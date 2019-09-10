import * as vscode from "vscode";

export class Commands {
  static registerCommands(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("nodeDependencies.editEntry", node =>
      vscode.window.showInformationMessage(
        `Successfully called edit entry on ${node}.`
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openmodel",
        async (
          confiFilePath: vscode.Uri,
          files: vscode.Uri[],
          rangeModel: vscode.Range
        ) => {
          // // open file source
          // await vscode.commands.executeCommand<vscode.Location[]>(
          //   "workbench.action.quickOpen",
          //   files
          // );

          // // Simulate ctrl + P
          // try {
          //   await vscode.commands.executeCommand<vscode.Location[]>(
          //     "workbench.action.quickOpen",
          //     "package.json"
          //   );
          // } catch (e) {
          //   console.error(e);
          // }

          // Open file openapi
          try {
            // let contexturl = vscode.Uri.file(
            //   vscode.workspace.rootPath + "/openapi.yaml"
            // );

            await vscode.commands.executeCommand<vscode.Location[]>(
              "vscode.open",
              confiFilePath
            );
          } catch (e) {
            console.error(e);
          }

          // Select range
          // let pos: vscode.Position = new vscode.Position(3, 2);
          // let pos2: vscode.Position = new vscode.Position(8, 4);
          // let range: vscode.Range = new vscode.Range(pos, pos2);
          let selection: vscode.Selection = new vscode.Selection(
            rangeModel.start,
            rangeModel.end
          );
          vscode.window.visibleTextEditors[0].selection = selection;
          vscode.window.visibleTextEditors[0].revealRange(rangeModel);

          // Open files
          this.openFiles(files);
        }
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openapi",
        async (
          confiFilePath: vscode.Uri,
          files: vscode.Uri[],
          rangeModel: vscode.Range
        ) => {
          // Open file openapi
          try {
            await vscode.commands.executeCommand<vscode.Location[]>(
              "vscode.open",
              confiFilePath
            );
          } catch (e) {
            console.error(e);
          }

          // Select range
          let selection: vscode.Selection = new vscode.Selection(
            rangeModel.start,
            rangeModel.end
          );
          vscode.window.visibleTextEditors[0].selection = selection;
          vscode.window.visibleTextEditors[0].revealRange(rangeModel);

          // Open files
          this.openFiles(files);
        }
      )
    );

    // Register commands
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "skaffolder.openpage",
        async (
          confiFilePath: vscode.Uri,
          files: vscode.Uri[],
          rangeModel: vscode.Range
        ) => {
          // Open file openapi
          try {
            await vscode.commands.executeCommand<vscode.Location[]>(
              "vscode.open",
              confiFilePath
            );
          } catch (e) {
            console.error(e);
          }

          // Select range
          let selection: vscode.Selection = new vscode.Selection(
            rangeModel.start,
            rangeModel.end
          );
          vscode.window.visibleTextEditors[0].selection = selection;
          vscode.window.visibleTextEditors[0].revealRange(rangeModel);

          // Open files
          this.openFiles(files);
        }
      )
    );
  }
  static openFiles(files: vscode.Uri[]) {
    // Open files
    let filesPath: string[] = [];
    files.forEach(item => {
      filesPath.push(item.path);
    });

    vscode.window.showQuickPick(filesPath).then(async item => {
      if (item) {
        let uri = vscode.Uri.file(item);
        await vscode.commands.executeCommand<vscode.Location[]>(
          "vscode.open",
          uri
        );
      }
    });
  }
}
