"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const treeProvider_1 = require("./treeProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(data) {
    var data = [
        {
            name: "Film",
            pos: 34,
            _attr: [
                {
                    name: "title",
                    pos: 37
                },
                {
                    name: "year",
                    pos: 40
                }
            ]
        },
        {
            name: "Actor",
            pos: 45,
            _attr: []
        }
    ];
    const jsonOutlineProvider = new treeProvider_1.TreeProvider(data);
    vscode.window.registerTreeDataProvider('skaffolderExplorer', jsonOutlineProvider);
    // vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
    // vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
    // // vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
    // vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map