app.controller("EditDbController", [
  "$scope",
  "DataService",
  function ($scope, DataService) {
    // Get data
    var getData = () => {
      DataService.getDb().then(data => {
        $scope.db = data;
      });
    }
    getData();

    DataService.onRequestedUpdate(getData);

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };
  }
]);
