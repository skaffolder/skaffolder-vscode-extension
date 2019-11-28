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
            $rootScope.$emit("root-scope-data", contextNode)
        }
    });
}])

app.controller("EditModelController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.$on('root-scope-data', (e, data) => {
        $scope.contextNode = data
        $scope.$apply()
    });

    $rootScope.controllerReady();
}]);
