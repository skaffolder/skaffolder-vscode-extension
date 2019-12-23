app.service("DataService", [
  "DataServiceUtils",
  function(DataServiceUtils) {
    return {
      // Call data
      savePage: page => {
        return DataServiceUtils.askData("savePage", page);
      },
      getPage: () => {
        return DataServiceUtils.askData("getPage");
      },
      chooseRole: roles => {
        return DataServiceUtils.askData("chooseRole", roles);
      },
      addLinked: link => {
        return DataServiceUtils.askData("addLinked", link);
      }
    };
  }
]);
