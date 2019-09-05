"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class TreeProvider {
    constructor(data) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.autoRefresh = true;
        console.log('init provider');
        console.log(data);
        this.autoRefresh = vscode.workspace.getConfiguration('skaffolderExplorer').get('autorefresh');
        vscode.workspace.onDidChangeConfiguration(() => {
            this.autoRefresh = vscode.workspace.getConfiguration('skaffolderExplorer').get('autorefresh');
        });
        this.onActiveEditorChange();
    }
    onActiveEditorChange() {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'json' || vscode.window.activeTextEditor.document.languageId === 'jsonc';
                vscode.commands.executeCommand('setContext', 'jsonOutlineEnabled', enabled);
            }
        }
        else {
            vscode.commands.executeCommand('setContext', 'jsonOutlineEnabled', false);
        }
    }
    getTreeItem(element) {
        throw new Error("Method not implemented.");
    }
    getChildren(element) {
        throw new Error("Method not implemented.");
    }
}
exports.TreeProvider = TreeProvider;
//# sourceMappingURL=treeProvider.js.map