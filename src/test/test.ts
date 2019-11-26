
import { SkaffolderNode } from "../models/SkaffolderNode";
import * as path from "path";
import * as vscode from "vscode";



export class Test {
    assetsFile = (name: string, extensionPath: string) => {

        const file = path.join(extensionPath, 'src', name);
        return vscode.Uri.file(file)
            .with({ scheme: 'vscode-resource' })
            .toString();
    }

    test1(contextNode: SkaffolderNode, extensionPath: string) {
        var dino =  this.assetsFile("", extensionPath);
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
            <link=rel="stylesheet" href="${ this.assetsFile("/css/editModel.css", extensionPath)}">
        </head>
        
        <body>
            <div ng-view></div>
        
        </body>
        <script src="${ this.assetsFile("/js/angular.min.js", extensionPath)}"></script>
        <script src="${ this.assetsFile("/js/angular-route.min.js", extensionPath)}"></script>
        <script src="${ this.assetsFile('/js/test.js', extensionPath)}"></script>
        
        </html>`;
    }
}