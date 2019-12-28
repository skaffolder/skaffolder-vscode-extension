import * as SkaffolderCli from "skaffolder-cli";
import { StatusBarManager } from "../utils/StatusBarManager";
import { refreshTree } from "../extension";
import { isFunction } from "util";

export class LoginCommand {
  static async command(callback: any) {
    SkaffolderCli.login(
      {},
      {},
      {
        info: function(msg: string) {
          console.log(msg);
        }
      },
      () => {
        refreshTree();
        StatusBarManager.refresh();
        if (isFunction(callback)) {
          callback();
        }
      }
    );
  }
}
