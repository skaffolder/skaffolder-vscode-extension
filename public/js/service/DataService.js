app.service("DataService", [
  "DataServiceUtils",
  function(DataServiceUtils) {
    return {
      // Call data
      getPage: () => {
        return DataServiceUtils.askData("getPage", response => {
          let data = JSON.parse(response);
          return data;
        });
      }
    };
  }
]);
