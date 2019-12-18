app.controller("EditModelController", ["$scope", "$rootScope", function ($scope, $rootScope) {

    // var ctrl = this;

    // this.addAttribute = function () {
    //     if (!this.entity) this.entity = {};

    //     if (!this.entity._attrs) this.entity._attrs = [];

    //     this.entity._attrs.push({
    //         name: null
    //     });
    // };

    

    $rootScope.$on('root-scope-data', (e, data) => {
        $scope.contextNode = data
        $scope.$apply()
    });
    $rootScope.controllerReady();
}]);