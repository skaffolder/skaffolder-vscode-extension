import * as vscode from "vscode";

export class TreeProvider implements vscode.TreeDataProvider<number> {
  private skObject = [
    {
      name: "Film",
      pos: 34,
      _attr: [
        {
          name: "title",
          pos: 37
        },
        {
          name: "year",
          pos: 40
        }
      ]
    },
    {
      name: "Actor",
      pos: 45,
      _attr: []
    }
  ];

  constructor(data: vscode.ExtensionContext) {
    console.log("init provider");
    vscode.commands.executeCommand("setContext", "jsonOutlineEnabled", true);

    // this.onActiveEditorChange();
  }

  // private onActiveEditorChange(): void {
  //   if (vscode.window.activeTextEditor) {
  //     if (vscode.window.activeTextEditor.document.uri.scheme === "file") {
  //       const enabled =
  //         vscode.window.activeTextEditor.document.languageId === "json" ||
  //         vscode.window.activeTextEditor.document.languageId === "jsonc";
  //       vscode.commands.executeCommand(
  //         "setContext",
  //         "jsonOutlineEnabled",
  //         enabled
  //       );
  //     }
  //   } else {
  //     vscode.commands.executeCommand("setContext", "jsonOutlineEnabled", false);
  //   }
  // }

  getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
    console.log(" Get tree item ", element);

    let myItem: vscode.TreeItem = new vscode.TreeItem(
      this.skObject[element - 1].name,
      vscode.TreeItemCollapsibleState.None
    );
    return myItem;
  }
  getChildren(element?: number | undefined): vscode.ProviderResult<number[]> {
    console.log("Get children ");
    const offsets: number[] = this.skObject.map((item, count) => {
      return count + 1;
    });
    console.log(offsets);

    return offsets;
  }
}
