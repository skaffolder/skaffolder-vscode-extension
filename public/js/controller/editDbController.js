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

    $scope.$on("requestedUpdate", e => {
      getData();
    });

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };
  }
]);
