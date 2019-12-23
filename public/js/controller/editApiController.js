app.controller("EditApiController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getApi().then(data => {
      $scope.api = data;
    });
  }
]);
