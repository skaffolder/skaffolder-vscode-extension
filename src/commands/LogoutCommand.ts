import * as SkaffolderCli from "skaffolder-cli";
import { StatusBarManager } from "../utils/StatusBarManager";
import * as vscode from "vscode";
import { refreshTree } from "../extension";

export class LogoutCommand {
  static async command(data: any) {
    try {
      SkaffolderCli.logout(null, null, {
        info: (msg: string) => {
          vscode.window.showInformationMessage(msg);
        }
      });
    } catch (e) {
      console.error(e);
    }
    StatusBarManager.refresh();
    refreshTree();
  }
}
