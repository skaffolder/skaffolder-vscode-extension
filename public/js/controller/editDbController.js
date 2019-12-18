app.controller("EditDbController", ["$scope", "$rootScope", function ($scope, $rootScope) {

    $rootScope.$on('root-scope-db', (e, data) => {
        $scope.db = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);