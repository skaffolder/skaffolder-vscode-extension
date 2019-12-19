app.controller("EditPageController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getPage().then(data => {
      $scope.page = data;
    });
  }
]);
