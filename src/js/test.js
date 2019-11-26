window.addEventListener('message', event => {
    const message = event.data;

    if (message.command == 'my-command') {
        contextNode = JSON.parse(message.data);
    }
});

var app = angular.module("Skaffolder_Extension", ['ngRoute']).config(["$routeProvider",
    function ($routeProvider) {
        console.log(globalPath)
        $routeProvider.otherwise({
            templateUrl: globalPath + "/html/editApi.html"
        })
    }]
)

app.run(["$rootScope", function ($rootScope) {
    console.log(globalPath);
    var cb = function () {
        if (typeof contextNode == "undefined") {
            setTimeout(cb, 10);
        } else {
            $rootScope.$emit('data', contextNode);
            $rootScope.data = contextNode;
        }
    }
    cb();
}])

app.controller("EditModelController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.$on("data", (e, data) => {
        $scope.contextNode = data;
        $scope.$apply();
    })

    $scope.ciccio = "ciaccioo2";
}]);
