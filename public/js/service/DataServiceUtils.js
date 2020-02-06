app.service("DataServiceUtils", [
  "$q",
  function($q) {
    return {
      askData: (command, param, callback) => {
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
              // window.removeEventListener("message", cb);
            } catch (err) {
              // Remove listener
              // window.removeEventListener("message", cb);
              deferred.reject(err);
            }
          }
        };

        // Execute callback
        window.addEventListener("message", cb);

        // Ask for data
        vscode.postMessage({
          command: command,
          data: param
        });

        // Return promise
        return deferred.promise;
      },
      onRequestedUpdate: (callback) => {
        window.addEventListener("message", event => {
          if (event.data.update) {
            if (callback) {
              callback();
            }
          }
        });
      }
    };
  }
]);
