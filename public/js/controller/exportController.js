app.controller("ExportController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    DataService.getLogs().then(data => {
      $scope.logs = data;
    });
  }
]);
