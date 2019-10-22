const counter = document.getElementById('lines-of-code-counter')
const vscode = acquireVsCodeApi();
var save = function() {
    counter.textContent = "test";
    vscode.postMessage({
        command: "save",
        text: "test"
    });
    
}
   