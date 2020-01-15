app.controller("EditApiController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    DataService.getApi().then(data => {
      $scope.api = data;
    });

    $scope.save = () => {
      DataService.saveApi($scope.api).then(data => {
        console.log("saved");
      });
    };

    $scope.delete = () => {
      DataService.removeApi($scope.api);
    }

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };

    // Roles functions
    $scope.removeRole = index => {
      $scope.api._roles.splice(index, 1);
    };

    $scope.addRole = index => {
      DataService.chooseRole($scope.api._roles).then(data => {
        if (data) {
          if (data == "* PUBLIC") {
            $scope.api._roles = undefined;
          } else if (data == "* PRIVATE") {
            $scope.api._roles = [];
          } else {
            if (!$scope.api._roles) $scope.api._roles = [];
            $scope.api._roles.push({ _id: data._id, name: data.name });
          }
        }
      });
    };

    // Parameters functions
    $scope.removeParam = index => {
      $scope.api._params.splice(index, 1);
    };

    $scope.addParam = () => {
      if (!$scope.api._params) $scope.api._params = [];
      $scope.api._params.push({});
    };
  }
]);
