app.controller("EditDbController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    DataService.getDb().then(data => {
      $scope.db = data;
    });

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };
  }
]);
