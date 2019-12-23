app.controller("EditDbController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getDb().then(data => {
      $scope.db = data;
    });
  }
]);
