app.service("DataService", [
  "DataServiceUtils",
  function(DataServiceUtils) {
    return {
      // Call data
      savePage: () => {
        return DataServiceUtils.askData("savePage");
      },
      getPage: () => {
        return DataServiceUtils.askData("getPage");
      }
    };
  }
]);
