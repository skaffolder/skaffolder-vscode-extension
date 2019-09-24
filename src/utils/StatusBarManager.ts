import * as vscode from "vscode";
import SkaffolderCli = require("skaffolder-cli");

export class StatusBarManager {
  static myStatusBarItem: vscode.StatusBarItem;

  static init() {
    StatusBarManager.myStatusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    StatusBarManager.myStatusBarItem.command = "skaffolder.login";
    StatusBarManager.refresh();
    StatusBarManager.myStatusBarItem.show();
  }

  static refresh() {
    console.log("refresh");
    let user: string | undefined = SkaffolderCli.getUser();
    if (user) {
      StatusBarManager.myStatusBarItem.text = "Skaffolder user: " + user;
    } else {
      StatusBarManager.myStatusBarItem.text = "Login in Skaffolder";
    }
  }
}
