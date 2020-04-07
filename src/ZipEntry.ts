import { ArchiveEntry, Archive } from "./ArchiveEntry";
import { TreeItem, Uri, TreeItemCollapsibleState, workspace } from "vscode";
import { sep } from "path";
import * as AdmZip from 'adm-zip';

export class ZipEntry extends TreeItem implements ArchiveEntry {

    private children: ZipEntry[];

    constructor(label: string, collapsible: TreeItemCollapsibleState, children: ZipEntry[]) {
        super(label, collapsible);
        this.children = children;
    }

    getChildren(): ArchiveEntry[] {
        return this.children; // TODO
    }

}

export class ZipFile extends ZipEntry implements Archive {

    static fileSuffix = ".zip";

    private uri: Uri;

    constructor(uri: Uri) {

        super(ZipFile.sliceNameFromUri(uri), TreeItemCollapsibleState.Expanded, ZipFile.createChildren(uri));
        this.uri = uri;
    }

    private static sliceNameFromUri(uri: Uri): string {
        let fsString = uri.fsPath.toString();
        return fsString.slice(fsString.lastIndexOf(sep) + 1, fsString.lastIndexOf("."));
    }

    getUri(): Uri {
        return this.uri;
    }

    private static createChildren(file: Uri): ZipEntry[] {
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