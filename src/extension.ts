// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ScriptsProvider } from './ScriptsProvider';
import path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log("TreeScopes");



	let disposables = [
		vscode.commands.registerCommand('tree-scopes.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from tree-scopes!');
		}),
		vscode.commands.registerCommand('tree-scopes.createScope', () => {
			context.workspaceState.update("label", Math.random());
		}),
		vscode.commands.registerCommand('tree-scopes.seeScope', () => {
			let label = context.workspaceState.get("label");
			if (label) {
				vscode.window.showInformationMessage(label + "");
			}
		}),
	];

	const rootPath =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: "";

	console.log("trootpath", rootPath);

	vscode.window.registerTreeDataProvider(
		'tree-scopes',
		new ScriptsProvider(path.join(rootPath, "package.json"))
	);

	disposables.forEach(disposable => {
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
