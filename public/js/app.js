var app = angular.module("Skaffolder_Extension", []).config([
  "$sceDelegateProvider",
  function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(["vscode-resource:/**"]);
  }
]);

vscode = acquireVsCodeApi();

// app.run(["$rootScope", function($rootScope) {}]);
