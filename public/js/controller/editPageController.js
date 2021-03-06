app.controller("EditPageController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    // Get data
    var getData = () => {
      DataService.getPage().then(data => {
        $scope.page = data;
        $scope.refreshResourceName();
      });
    }
    getData();

    // Actions
    $scope.openFiles = () => {
      DataService.openFiles();
    };

    $scope.$on("requestedUpdate", e => {
      getData();
    });
  
    $scope.save = () => {
      DataService.savePage($scope.page).then(data => {
        console.log("saved");
      });
    };

    $scope.delete = () => {
      if ($scope.page && $scope.page.page) {
        DataService.removePage($scope.page.page);
      }
    }

    // Linked functions
    $scope.addLinked = index => {
      DataService.addLinked($scope.page.page._links).then(data => {
        if(data) {
          if($scope.page.page._links === null) {
            $scope.page.page._links = [];
          } 
          $scope.page.page._links.push({ _id: data._id, name: data.name });
        }
      })
    };

    $scope.removeLink = index => {
      $scope.page.page._links.splice(index, 1);
    };

    $scope.addNested = index => {
      DataService.addNested($scope.page.page._nesteds).then(data => {
        if(data) {
          if($scope.page.page._nesteds === null) {
            $scope.page.page._nesteds = [];
          }
          $scope.page.page._nesteds.push({ _id: data._id, name: data.name });
        }
      })
    }

    $scope.removeNested = index => {
      $scope.page.page._nesteds.splice(index, 1);
    }
    

    // Roles functions
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

    // Template functions

    $scope.addTemplate = () => {
      DataService.addTemplate().then(data => {
        if(data) {
          if($scope.page.page.template === null ) {
            $scope.page.page.template = [];
          }
          $scope.page.page.template = data.type + "_Crud";
          $scope.page.page._template_resource = data.value;

          $scope.refreshResourceName();
        }
      })
    }
    $scope.removeTemplate = () =>  {
      $scope.page.page.template = undefined;
      $scope.page.page._template_resource = undefined;
    }

    $scope.refreshResourceName = () => {
      if($scope.page.page._template_resource) {
        DataService.getResourceName($scope.page.page._template_resource).then(data => {
          $scope.resourceCrudName = data;
        });
      }
    }

    //API functions

    $scope.addApi = index => {
      DataService.addApi($scope.page.page._services).then(data => {
         if(data) {
          if($scope.page.page._services === null) {
            $scope.page.page._services = [];
          }
         $scope.page.page._services.push({ _id: data.id, _resource: {name: data.nameResource } ,name: data.label, method: data.method });
         }
      })
    }

    $scope.removeApi = index => {
      $scope.page.page._services.splice(index, 1);
    } 
  }
]);
