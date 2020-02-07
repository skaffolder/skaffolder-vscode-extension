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

	public async updatePanel(silentUpdate = false) {
		this.panel.title = this.getTitle();
		this.notifyUpdate();

		if (!silentUpdate) {
			this.openYamlFile(this.getYamlID());
		}

		if (!silentUpdate && !this.panel.visible) {
			this.panel.reveal();
		}
	}

	private notifyUpdate() {
		this.panel.webview.postMessage({
			update: true
		});
	}

	private async openYamlFile(idItem: string | undefined) {
		if (idItem) {
			await vscode.commands.executeCommand<vscode.Location[]>("skaffolder.openyaml", idItem);
		}
	}

	public abstract registerPanelListeners(): void;

	public abstract registerOnDisposePanel(): void;

	public abstract getTitle(): string;

	public abstract getYamlID(): string | undefined;
}