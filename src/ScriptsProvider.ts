import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class ScriptsProvider {

    constructor(private workspaceRoot: string) { }

    // getTreeItem(element: Script): vscode.TreeItem {
    //     return element;
    // }

    // getChildren(element?: Script): Thenable<Script[]> {
    //     if (!element) {
    //         return Promise.resolve(this.getScripts(this.workspaceRoot));
    //     }
    //     return Promise.resolve([]);
    // }

    static getScripts(packageJsonPath: string): Script[] {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

        let scripts: Script[] = [];

        if (packageJson.scripts) {
            Object.keys(packageJson.scripts).forEach(scriptName => {
                scripts.push(new Script(
                    scriptName,
                    packageJson.scripts[scriptName],
                    vscode.TreeItemCollapsibleState.None
                ));
            });
        }

        return scripts;
    }

}

class Script extends vscode.TreeItem {
    constructor(
        public readonly scriptName: string,
        private script: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(scriptName, collapsibleState);
        this.tooltip = `${scriptName} - ${script}`;
        // this.description = script;
    }

    iconPath = {
        light: path.join(__filename, "..", "assets", "icons", "light", "script.svg"),
        dark: path.join(__filename, "..", "assets", "icons", "dark", "script.svg"),
    };
}