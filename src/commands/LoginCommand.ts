import * as SkaffolderCli from "skaffolder-cli";
import { StatusBarManager } from "../utils/StatusBarManager";

export class LoginCommand {
  static async command(data: any) {
    SkaffolderCli.login(
      {},
      {},
      {
        info: function(msg: string) {
          console.log(msg);
        }
      },
      StatusBarManager.refresh
    );
  }
}
