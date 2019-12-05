import * as path from "path";
import * as vscode from "vscode";

export class Webview {
    assetsFile = (name: string, extensionPath: string) => {

        const file = path.join(extensionPath, 'src', name);
        return vscode.Uri.file(file)
            .with({ scheme: 'vscode-resource' })
            .toString();
    }

    webView(extensionPath: string, page: string) {
        var dino = this.assetsFile("", extensionPath);
        console.log(dino);

        return `<!DOCTYPE html>
        <html lang="en" ng-app="Skaffolder_Extension">
        
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' vscode-resource: https:;
                                                 script-src vscode-resource: 'self' 'unsafe-inline' 'unsafe-eval' https:;
                                                 style-src vscode-resource: 'self' 'unsafe-inline';
                                                 img-src 'self' vscode-resource: data:" />
            <title>Edit Model</title>
            <link rel="stylesheet" href="${ this.assetsFile("/css/style.css", extensionPath)}">
        </head>
        
        <body>
            <div ng-include="'${ this.assetsFile(`/html/${page}.html`, extensionPath)}'"></div>
        </body>
        <script src="${ this.assetsFile("/js/angular.min.js", extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/app.js', extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/controller/editModelController.js', extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/controller/editApiController.js', extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/controller/editPageController.js', extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/controller/editDbController.js', extensionPath)}"></script>
        
        </html>`;
    }
}