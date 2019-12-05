vscode = acquireVsCodeApi();

var app = angular.module("Skaffolder_Extension", []).config(["$sceDelegateProvider", function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        "vscode-resource:/**"
    ])
}])

app.run(["$rootScope", function ($rootScope) {
    $rootScope.controllerReady = () => {
        vscode.postMessage({
            command: "webview-ready"
        });
    }

    window.addEventListener('message', (event) => {
        const message = event.data;

        if (message.command == 'get-data') {
            let contextNode = JSON.parse(message.data);
            $rootScope.$emit("root-scope-data", contextNode);
        }
        if (message.command == 'get-service') {
            let service = JSON.parse(message.data);
            $rootScope.$emit("root-scope-service", service);
        }
        if (message.command == 'get-db') {
            let db = JSON.parse(message.data);
            $rootScope.$emit("root-scope-db", db);
        }
        if (message.command == 'get-page') {
            let page = JSON.parse(message.data);
            $rootScope.$emit("root-scope-db", page);
        }
    });

    
}])

