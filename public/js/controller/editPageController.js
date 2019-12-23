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

    $scope.addLinked = () => {
      DataService.addLinked($scope.page).then(data => {
      })
    }

    $scope.removeRole = index => {
      $scope.page.page._roles.splice(index, 1);
    };

    $scope.addRole = index => {
      DataService.chooseRole($scope.page.page._roles).then(data => {
        if (data) {
          if (data == "* PUBLIC") {
            $scope.page.page._roles = undefined;
          } else if (data == "* PRIVATE") {
            $scope.page.page._roles = [];
          } else {
            if (!$scope.page.page._roles) $scope.page.page._roles = [];
            $scope.page.page._roles.push({ _id: data._id, name: data.name });
          }
        }
      });
    };
  }
]);
