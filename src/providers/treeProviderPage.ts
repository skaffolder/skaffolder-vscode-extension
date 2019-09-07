import * as vscode from "vscode";

export class TreeProviderPage implements vscode.TreeDataProvider<number> {
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
    console.log("init provider api");
  }

  getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
    // console.log(" Get tree item ", element);

    let myItem: vscode.TreeItem = new vscode.TreeItem(
      this.skObject[element - 1].name,
      vscode.TreeItemCollapsibleState.None
    );
    return myItem;
  }

  getChildren(element?: number | undefined): vscode.ProviderResult<number[]> {
    // console.log("Get children ");
    const offsets: number[] = this.skObject.map((item, count) => {
      return count + 1;
    });
    console.log(offsets);

    return offsets;
  }
}
