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
      addLinked: link => {
        return DataServiceUtils.askData("addLinked", link);
      },
      addNested: nested => {
        return DataServiceUtils.askData("addNested", nested)
      },
      addTemplate: template => {
        return DataServiceUtils.askData("addTemplate", template)
      },
      getResourceName: idRes => {
        return DataServiceUtils.askData("getResourceName", idRes)
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
      openFiles: link => {
        return DataServiceUtils.askData("openFiles", link);
      }
    };
  }
]);
