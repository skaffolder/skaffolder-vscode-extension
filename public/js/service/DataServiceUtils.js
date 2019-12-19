app.service("DataServiceUtils", [
  "$q",
  function($q) {
    return {
      askData: (command, callback) => {
        // Init promise
        const deferred = $q.defer();

        const cb = event => {
          if (event.data.command == command) {
            try {
              let data = event.data.data;

              // Execute callback
              if (callback) data = callback(event.data.data);
              deferred.resolve(data);

              // Remove listener
              window.removeEventListener("message", cb);
            } catch (err) {
              // Remove listener
              window.removeEventListener("message", cb);
              deferred.reject(err);
            }
          }
        };

        // Execute callback
        window.addEventListener("message", cb);

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
