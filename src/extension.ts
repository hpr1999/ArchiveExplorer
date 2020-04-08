// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ArchiveTreeExplorer } from './ArchiveTreeExplorer';
import { RootCreator } from './rootCreator';
import { ArchiveEntry } from './ArchiveEntry';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const explorer = new ArchiveTreeExplorer();

	const view = vscode.window.createTreeView("archives", { treeDataProvider: explorer, canSelectMany: false, showCollapseAll: true });

	vscode.window.onDidChangeActiveTextEditor(e => {
		if (e?.document) {
			let root = RootCreator.createArchiveRoot(e.document.uri);
			if (root) {
				explorer.addRoot(root);
				vscode.commands.executeCommand("workbench.action.closeActiveEditor");

			}
		}
	});

	context.subscriptions.push(
		vscode.commands.registerCommand("archiveexplorer.treeView.removeRoot", (node: ArchiveEntry) => {
			if (node) { explorer.removeRoot(node); }
		}),
		vscode.commands.registerCommand("archiveexplorer.treeView.addRoot", (uri: vscode.Uri) => {
			if (uri) {
				let root = RootCreator.createArchiveRoot(uri);
				if (root) {
					explorer.addRoot(root);
				}
			};
		})
	);

	context.subscriptions.push(view);
}

// this method is called when your extension is deactivated
export function deactivate() { }
