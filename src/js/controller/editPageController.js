app.controller("EditPageController", ["$scope", "$rootScope", function ($scope, $rootScope) {

    $rootScope.$on('root-scope-db', (e, data) => {
        $scope.page = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);