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
      // Model
      getModel: () => {
        return DataServiceUtils.askData("getModel");
      },
      getAllModels: () => {
        return DataServiceUtils.askData("getAllModels");
      },
      // Db
      getDb: () => {
        return DataServiceUtils.askData("getDb");
      },
      // API
      getApi: () => {
        return DataServiceUtils.askData("getApi");
      },

      // Utils
      chooseRole: roles => {
        return DataServiceUtils.askData("chooseRole", roles);
      },
      addLinked: link => {
        return DataServiceUtils.askData("addLinked", link);
      },
      openFiles: link => {
        return DataServiceUtils.askData("openFiles", link);
      }
    };
  }
]);
