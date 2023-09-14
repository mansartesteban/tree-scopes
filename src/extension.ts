// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ScriptsProvider } from './ScriptsProvider';
import path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let terminal: vscode.Terminal | null = null;

	const rootPath =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: "";
	const scripts = ScriptsProvider.getScripts(path.join(rootPath, "package.json"));

	// const scriptProvider = new ScriptsProvider(path.join(rootPath, "package.json"));
	// vscode.window.registerTreeDataProvider(
	// 	'tree-scopes.veiws',
	// 	scriptProvider
	// );


	let treeScopeViewProvider = new TreeScopeViewProvider({ scripts });

	console.log(treeScopeViewProvider);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("tree-scopes.views.main", treeScopeViewProvider)
		// vscode.
	);
	// vscode.window.registerWebviewPanelSerializer('tree-scopes', new TreeScopesSerializer());

	let disposables = [
		vscode.commands.registerCommand('tree-scopes.commands.start', () => {

			// const panel = vscode.window.createWebviewPanel("tree-scopes", "Tree scopes", vscode.ViewColumn.One);
			// panel.webview.html = createTreeScopesView();
		}),
		vscode.commands.registerCommand('tree-scopes.commands.createScope', () => {
			context.workspaceState.update("label", Math.random());
		}),
		vscode.commands.registerCommand('tree-scopes.commands.refreshTreeScopes', () => {
			treeScopeViewProvider.update({ scripts: [{ label: "script-" + Math.random() }] });
		}),
		vscode.commands.registerCommand('tree-scopes.commands.renameScript', () => {
			console.log("rename");
		}),
		vscode.commands.registerCommand('tree-scopes.commands.launchScript', (params) => {
			if (!terminal) {
				terminal = vscode.window.createTerminal('npm');
			}
			terminal.show();
			terminal.sendText(["pnpm", "run", params.scriptName].join(' '));
		}),
		vscode.commands.registerCommand('tree-scopes.commands.seeScope', () => {
			let label = context.workspaceState.get("label");
			if (label) {
				vscode.window.showInformationMessage(label + "");
			}
		}),
	];
	disposables.forEach(disposable => {
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }



class TreeScopeViewProvider implements vscode.WebviewViewProvider {

	webviewView: vscode.WebviewView | undefined;
	datas: Object;

	constructor(datas: Object) {
		this.datas = datas;
	}

	resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
		this.webviewView = webviewView;

		this.webviewView.webview.html = createTreeScopesView(this.datas);
	}

	update(datas: Object) {
		this.datas = datas;
		if (this.webviewView) {
			this.webviewView.webview.html = createTreeScopesView(this.datas);
		}
	}

}


function createTreeScopesView(datas: any) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <ul>
		<li>${datas.scripts[0].label}</li>
	</ul>
</body>
</html>`;
}