// Get vscode api
vscode = acquireVsCodeApi();

// Start app
var app = angular.module("Skaffolder_Extension", []).config([
  "$sceProvider",
  function($sceProvider) {
    $sceProvider.enabled(false);
  }
]);

angular.element(document).ready(function () {  
  angular.bootstrap(document, ['Skaffolder_Extension']);
});

// Init app
app.run([
  "$rootScope",
  function($rootScope) {
    $rootScope.pathExtension = pathExtension;

    window.addEventListener("message", event => {
      if (event.data.update) {
        $rootScope.$broadcast("requestedUpdate");
      }
    });
  }
]);

// Filter
app.filter("to_trusted", [
  "$sce",
  function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }
]);
