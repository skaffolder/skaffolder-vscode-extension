app.controller("EditModelController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    DataService.getModel().then(data => {
      $scope.model = data;
    });

    // Attribues functions
    $scope.removeAttr = index => {
      $scope.model._entity._attrs.splice(index, 1);
    };

    $scope.addAttr = () => {
      if (!$scope.model._entity._attrs) $scope.model._entity._attrs = [];
      $scope.model._entity._attrs.push({});
    };

    // Enumerations functions
    $scope.removeEnum = (index, attr) => {
      attr._enum.splice(index, 1);
    };

    $scope.addEnum = attr => {
      if (!attr._enum) attr._enum = [];
      attr._enum.push({});
      return attr;
    };
  }
]);
