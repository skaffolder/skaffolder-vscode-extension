app.service("DataService", [
  "$rootScope",
  "$q",
  function($rootScope, $q) {
    return {
      getPage: () => {
        // Init promise
        const deferred = $q.defer();
        const command = "getPage";

        const callback = event => {
          console.log("get message");
          if (event.data.command == command) {
            let data = JSON.parse(event.data.data);
            deferred.resolve(data);

            // Remove listener
            window.removeEventListener("message", callback);
          }
        };

        console.log("ask message");

        // Execute callback
        window.addEventListener("message", callback);

        // Ask for data
        vscode.postMessage({
          command: command
        });

        // Return promise
        return deferred.promise;
      }
    };
  }
]);
