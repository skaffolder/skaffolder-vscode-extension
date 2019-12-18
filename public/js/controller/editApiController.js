app.controller("EditApiController", ["$scope", "$rootScope", function ($scope, $rootScope) {

    $rootScope.$on('root-scope-service', (e, data) => {
        $scope.service = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);