import { SkaffolderNode } from "../models/SkaffolderNode";
import { DataService } from "../services/DataService";
import * as SkaffolderCli from "skaffolder-cli";
const opn = require("opn");

export class GoToSkaffolderCommand {
  static async command(context: SkaffolderNode) {
    const obj = DataService.getSkObject();
    let projectId = obj.project ? obj.project._id : "";

    let url = `${SkaffolderCli.getEnv()}/#!/projects/${projectId}/models`;
    opn(url, {
      wait: false
    });
  }
}
