import { DataService } from "../services/DataService";
import { SkaffolderNode } from "../models/SkaffolderNode";
import { Utils } from "../utils/Utils";
import { Db } from "../models/jsonreader/db";
import { Page } from "../models/jsonreader/page";
import { Resource } from "../models/jsonreader/resource";

export class OpenFilesCommand {
  static async command(context: SkaffolderNode) {
    // Open files
    try {
      if (context.params) {
        if (context.params.type === "resource") {
          let files = DataService.findRelatedFiles(
            "resource",
            context.params.model as Resource,
            context.params.db as Db
          );
          Utils.openFiles(files);
        } else if (context.params.type === "module") {
          let files = DataService.findRelatedFiles("module", context.params
            .page as Page);
          Utils.openFiles(files);
        } else if (context.params.type === "db") {
          let files = DataService.findRelatedFiles("db", context.params
            .db as Db);
          Utils.openFiles(files);
        } else {
          console.error("Type " + context.params.type + " not valid");
        }
      } else {
        console.error("Type node not provided");
      }
    } catch (e) {
      console.error(e);
    }
  }
}
