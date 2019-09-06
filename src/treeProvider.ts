import * as vscode from "vscode";
import * as json from "jsonc-parser";

export class TreeProvider implements vscode.TreeDataProvider<number> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    number | null
  > = new vscode.EventEmitter<number | null>();

  private autoRefresh: boolean = true;

  constructor(data: vscode.ExtensionContext) {
    console.log("init provider");
    console.log(data);
    this.autoRefresh = vscode.workspace
      .getConfiguration("skaffolderExplorer")
      .get("autorefresh");
    vscode.workspace.onDidChangeConfiguration(() => {
      this.autoRefresh = vscode.workspace
        .getConfiguration("skaffolderExplorer")
        .get("autorefresh");
    });
    this.onActiveEditorChange();
  }

  private onActiveEditorChange(): void {
    if (vscode.window.activeTextEditor) {
      if (vscode.window.activeTextEditor.document.uri.scheme === "file") {
        const enabled =
          vscode.window.activeTextEditor.document.languageId === "json" ||
          vscode.window.activeTextEditor.document.languageId === "jsonc";
        vscode.commands.executeCommand(
          "setContext",
          "jsonOutlineEnabled",
          enabled
        );
      }
    } else {
      vscode.commands.executeCommand("setContext", "jsonOutlineEnabled", false);
    }
  }

  getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
    // throw new Error("Method not implemented.");
    console.log(" Get tree item ", element);

    let myItem: vscode.TreeItem = new vscode.TreeItem(
      "Label",
      vscode.TreeItemCollapsibleState.None
    );
    // myItem.command = {
    //   command: "extension.openJsonSelection",
    //   title: "",
    //   arguments: [
    //     new vscode.Range(
    //       this.editor.document.positionAt(valueNode.offset),
    //       this.editor.document.positionAt(valueNode.offset + valueNode.length)
    //     )
    //   ]
    // };
    // myItem.iconPath = this.getIcon(valueNode);
    // myItem.contextValue = valueNode.type;
    return myItem;
  }
  getChildren(element?: number | undefined): vscode.ProviderResult<number[]> {
    console.log(" Get children ", element);
    // throw new Error("Method not implemented.");
    const offsets: number[] = [1, 3];

    return offsets;
  }
}
