app.controller("EditPageController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getPage().then(data => {
      $scope.page = data;
    });

    $scope.save = () => {
      DataService.savePage($scope.page).then(data => {
        console.log("saved");
      });
    };
  }
]);
