app.controller("EditModelController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    console.log("ok");
    DataService.getModel().then(data => {
      console.log(data);
      $scope.model = data;
    });
  }
]);
