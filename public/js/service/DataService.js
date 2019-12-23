app.service("DataService", [
  "DataServiceUtils",
  function(DataServiceUtils) {
    return {
      // Page
      savePage: page => {
        return DataServiceUtils.askData("savePage", page);
      },
      getPage: () => {
        return DataServiceUtils.askData("getPage");
      },
      chooseRole: roles => {
        return DataServiceUtils.askData("chooseRole", roles);
      },
      // Model
      getModel: () => {
        return DataServiceUtils.askData("getModel");
      },
      // Db
      getDb: () => {
        return DataServiceUtils.askData("getDb");
      },
      // API
      getApi: () => {
        return DataServiceUtils.askData("getApi");
      }
    };
  }
]);
