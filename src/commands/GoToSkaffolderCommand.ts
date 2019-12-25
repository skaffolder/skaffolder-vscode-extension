import { SkaffolderNode } from "../models/SkaffolderNode";
import { DataService } from "../services/DataService";
const opn = require("opn");

export class GoToSkaffolderCommand {
  static async command(context: SkaffolderNode) {
    const obj = DataService.getSkObject();
    let projectId = obj.project ? obj.project._id : "";
    let url = `https://app.skaffolder.com/#!/projects/${projectId}/models`;
    opn(url, {
      wait: false
    });
  }
}
