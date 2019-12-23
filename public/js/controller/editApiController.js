app.controller("EditApiController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    DataService.getApi().then(data => {
      $scope.api = data;
    });

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

    $scope.removeParam = index => {
      $scope.api._params.splice(index, 1);
    };

    $scope.addParam = () => {
      if (!$scope.api._params) $scope.api._params = [];
      $scope.api._params.push({});
    };
  }
]);
