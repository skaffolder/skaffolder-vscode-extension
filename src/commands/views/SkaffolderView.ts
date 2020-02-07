import * as vscode from 'vscode';
import { SkaffolderNode } from '../../models/SkaffolderNode';
import { Offline } from 'skaffolder-cli';

export abstract class SkaffolderView {
	public panel: vscode.WebviewPanel;
	static instance?: SkaffolderView;
	static viewTitle: string;

	constructor(public contextNode: SkaffolderNode) {
		this.panel = vscode.window.createWebviewPanel("skaffolder", "Sk", vscode.ViewColumn.One, {
			enableScripts: true
		});

		if (vscode.workspace.rootPath !== undefined) {
			Offline.pathWorkspace = vscode.workspace.rootPath;
		}

		this.registerPanelListeners();
		this.registerOnDisposePanel();
	}

	public async updatePanel() {
		this.panel.title = this.getTitle();
		this.notifyUpdate();

		let _id = this.getYamlID();
		if (_id) {
			await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", _id);
		}

		if (!this.panel.visible) {
			this.panel.reveal();
		}
	}

	private notifyUpdate() {
		this.panel.webview.postMessage({
			update: true
		});
	}

	public abstract registerPanelListeners(): void;

	public abstract registerOnDisposePanel(): void;

	public abstract getTitle(): string;

	public abstract getYamlID(): string | undefined;
}