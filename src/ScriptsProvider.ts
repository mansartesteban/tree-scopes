import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ScriptsProvider implements vscode.TreeDataProvider<Script> {
    constructor(private workspaceRoot: string) { }

    getTreeItem(element: Script): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Script): Thenable<Script[]> {
        if (!element) {
            return Promise.resolve(this.getScripts(this.workspaceRoot));
        }
        return Promise.resolve([]);
    }

    getScripts(packageJsonPath: string): Script[] {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        let scripts: Script[] = [];

        if (packageJson.scripts) {
            Object.keys(packageJson.scripts).forEach(scriptName => {
                scripts.push(new Script(
                    scriptName,
                    packageJson.scripts[scriptName],
                    vscode.TreeItemCollapsibleState.Collapsed
                ));
            })
        }

        return scripts;
    }

}

class Script extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private details: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label} - ${this.details}`;
        this.description = this.details;
    }

    iconPath = {
        light: path.join('assets', 'icons', 'light', 'script.svg'),
        dark: path.join('assets', 'icons', 'dark', 'script.svg'),
    };
}