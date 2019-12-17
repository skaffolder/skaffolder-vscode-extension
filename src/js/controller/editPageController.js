app.controller("EditPageController", ["$scope", "$rootScope", function ($scope, $rootScope) {

    $rootScope.$on('root-scope-page', (e, data) => {
        $scope.page = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);