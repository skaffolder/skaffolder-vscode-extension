import { DataService } from "../services/DataService";

export class ExportCommand {
  static async command() {
    let params: any = DataService.readConfig();
    params.skObject = DataService.getYaml();
    DataService.exportProject(params, function(err: any, logs: any) {
      console.log(err, logs);
    });
  }
}
