app.controller("EditModelController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    var getData = () => {
      DataService.getModel().then(data => {
        $scope.model = data.entity;
        $scope.service = data.service;
      });
      DataService.getAllModels().then(data => {
        $scope.model_list = data;
      });
    }
    getData();

    DataService.onRequestedUpdate(getData);

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };

    $scope.save = () => {
      DataService.saveModel($scope.model).then(data => {
        console.log("saved");
      });
    };
    
    $scope.delete = () => {
      DataService.removeModel($scope.model);
    };
    
    $scope.addApi = () => {
      DataService.addApiModel();
    }

    $scope.createCrud = () => {
      DataService.createCrud($scope.model);
    }

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

    // Relations functions
    $scope.removeRel = index => {
      $scope.model._entity._relations.splice(index, 1);
    };

    $scope.addRel = () => {
      if (!$scope.model._entity._relations) {
        $scope.model._entity._relations = [];
      }
      $scope.model._entity._relations.push({});
    };
  }
]);
