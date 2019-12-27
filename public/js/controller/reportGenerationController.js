console.log("file contr");
app.controller("ReportGenerationController", [
  "$scope",
  "DataService",
  function($scope, DataService) {
    $scope.getImg = () => {
      return pathExtension + "img/logo_white.svg";
    };

    // Get data
    console.log("call service");
    DataService.getLogs().then(data => {
      console.log("response service");
      console.log(data);
      $scope.logs = data;
    });
  }
]);
