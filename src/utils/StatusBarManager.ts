import * as vscode from "vscode";
import SkaffolderCli = require("skaffolder-cli");
import { refreshTree } from "../extension";

export class StatusBarManager {
  static myStatusBarItem: vscode.StatusBarItem;

  static init() {
    StatusBarManager.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    StatusBarManager.myStatusBarItem.command = "skaffolder.login";
    StatusBarManager.refresh();
    StatusBarManager.myStatusBarItem.show();
  }

  static refresh(): string | undefined {
    let user: string | undefined = SkaffolderCli.getUser();

    if (user) {
      StatusBarManager.myStatusBarItem.text = "Skaffolder user: " + user;
      vscode.commands.executeCommand("setContext", "isLogged", true);
      vscode.commands.executeCommand("setContext", "userLogged", user);
    } else {
      StatusBarManager.myStatusBarItem.text = "Login in Skaffolder";
      vscode.commands.executeCommand("setContext", "isLogged", false);
      vscode.commands.executeCommand("setContext", "userLogged", undefined);
    }

    return user;
  }
}
