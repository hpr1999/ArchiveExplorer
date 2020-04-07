import { TreeItemCollapsibleState, Uri } from "vscode";
import { ZipEntry } from "./ZipEntry";
import * as AdmZip from "adm-zip";

export class ZipParser {
    // TODO change into createZipFile
    public static createChildren(file: Uri): ZipEntry[] {
        let zip = new AdmZip(file.fsPath);
        let childrenMap = new Map<string, Set<string>>();

        for (let entry of zip.getEntries()) {
            this.parseEntry(entry.entryName, childrenMap);
        }

        let stringToEntry = new Map<string, ZipEntry>();

        for (const [entry, children] of childrenMap.entries()) {
            let name = entry.slice(entry.lastIndexOf("/") + 1);
            let collapsible = children.size > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
            stringToEntry.set(entry, new ZipEntry(name, collapsible, []));
        }
        for (const [entry, children] of childrenMap.entries()) {
            for (const child of children) {
                let childEntry = stringToEntry.get(child);
                if (childEntry) {
                    stringToEntry.get(entry)?.getChildren().push(childEntry);
                }
            }
        }

        let rootChildren = childrenMap.get("/");
        let result: ZipEntry[] = [];
        if (rootChildren) {
            for (const child of rootChildren) {
                let entry = stringToEntry.get(child);
                if (entry) {
                    result.push(entry);
                }
            }
        }

        return result;
    }

    private static parseEntry(entryName: string, map: Map<string, Set<string>>): void {
        let wip = entryName;

        if (entryName.endsWith("/")) {
            wip = entryName.slice(0, entryName.length - 1);
        }

        let strings = wip.split("/");

        let cumulativeString;
        let oldCumulativeString;

        for (let index = strings.length - 1; index >= 0; index--) {
            cumulativeString = strings.slice(0, index + 1).join("/");

            if (!map.has(cumulativeString)) {
                map.set(cumulativeString, new Set);
                if (oldCumulativeString) { map.get(cumulativeString)?.add(oldCumulativeString); }
            } else {
                if (oldCumulativeString) { map.get(cumulativeString)?.add(oldCumulativeString); }
                return;
            }
            oldCumulativeString = cumulativeString;
        }

        if (!map.has("/")) {
            map.set("/", new Set);
        }

        map.get("/")?.add(strings[0]);
    }
}