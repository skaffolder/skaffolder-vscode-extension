import { EditNodeCommand } from "../commands/EditNodeCommand";
import * as path from "path";
import * as vscode from "vscode";

export class Webview {
  static serve(page: string) {
    return `<!DOCTYPE html>
    <html lang="en" ng-app="Skaffolder_Extension">
        
        <head>
            <title>Skaffolder</title>
            <link rel="stylesheet" href="${Webview.assetsFile("/css/style.css")}">
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' vscode-resource: https:;
                script-src vscode-resource: 'self' 'unsafe-inline' 'unsafe-eval' https:;
                style-src vscode-resource: 'self' 'unsafe-inline';
                img-src 'self' vscode-resource: data:" />
        </head>
        
        <body>
            <div ng-include="'${Webview.assetsFile(`/html/${page}.html`)}'"></div>
        </body>

        <!-- Import --> 
        <script src="${Webview.assetsFile("/js/angular.min.js")}"></script>
        <script src="${Webview.assetsFile("/js/app.js")}"></script>
        
        <!-- Import Services --> 
        <script src="${Webview.assetsFile("/js/service/DataServiceUtils.js")}"></script>
        <script src="${Webview.assetsFile("/js/service/DataService.js")}"></script>
        
        <!-- Import Controllers --> 
        <script src="${Webview.assetsFile("/js/controller/editModelController.js")}"></script>
        <script src="${Webview.assetsFile("/js/controller/editApiController.js")}"></script>
        <script src="${Webview.assetsFile("/js/controller/editPageController.js")}"></script>
        <script src="${Webview.assetsFile("/js/controller/editDbController.js")}"></script>
        
    </html>`;
  }

  static assetsFile = (name: string) => {
    const extensionPath = EditNodeCommand.context.extensionPath;
    const file = path.join(extensionPath, "public", name);
    return vscode.Uri.file(file)
      .with({ scheme: "vscode-resource" })
      .toString();
  }
}
