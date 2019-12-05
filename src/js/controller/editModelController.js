app.controller("EditModelController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    
    $rootScope.$on('root-scope-data', (e, data) => {
        $scope.contextNode = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);