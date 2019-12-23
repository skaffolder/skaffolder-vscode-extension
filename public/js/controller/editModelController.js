app.controller("EditModelController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getModel().then(data => {
      $scope.model = data;
    });
  }
]);
