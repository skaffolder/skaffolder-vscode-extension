import * as vscode from 'vscode';
import * as json from 'jsonc-parser';

export class TreeProvider implements vscode.TreeDataProvider<number> {
    
    private _onDidChangeTreeData: vscode.EventEmitter<number | null> = new vscode.EventEmitter<number | null>();
    
    
    private autoRefresh: boolean = true;

    constructor(data: vscode.ExtensionContext) {
        console.log('init provider');
        console.log(data);
        this.autoRefresh = vscode.workspace.getConfiguration('skaffolderExplorer').get('autorefresh');
        vscode.workspace.onDidChangeConfiguration(()=> {
            this.autoRefresh = vscode.workspace.getConfiguration('skaffolderExplorer').get('autorefresh');
        });
        this.onActiveEditorChange();
    }

    private onActiveEditorChange(): void {
        if(vscode.window.activeTextEditor) {
            if(vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'json' || vscode.window.activeTextEditor.document.languageId === 'jsonc';
                vscode.commands.executeCommand('setContext', 'jsonOutlineEnabled', enabled);
            }
        } else {
            vscode.commands.executeCommand('setContext', 'jsonOutlineEnabled', false);
        }
    }  
    
    getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error("Method not implemented.");
    }
    getChildren(element?: number | undefined): vscode.ProviderResult<number[]> {
        throw new Error("Method not implemented.");
    }


}