import { refreshTree } from "../extension";

export class RefreshCommand {
  static async command() {
    refreshTree();
  }
}
