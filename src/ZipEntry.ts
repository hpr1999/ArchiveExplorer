import * as AdmZip from "adm-zip";
import { IZipEntry } from "adm-zip";
import { Uri, TreeItem, TreeItemCollapsibleState } from "vscode";
import { ArchiveEntry } from "./ArchiveEntry";
import { sep } from "path";

export class ZipEntry extends TreeItem implements ArchiveEntry {
    entry: AdmZip.IZipEntry | null;
    uri: Uri;
    children: ZipEntry[];
    entryName: string;

    constructor(entryName: string, entry: IZipEntry | null, fileUri: Uri, children: ZipEntry[]) {
        super(ZipEntry.sliceLabelFromEntryName(entryName), (entry ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed));
        this.entry = entry;
        this.entryName = entryName;
        // TODO check uri
        this.uri = Uri.parse("zip://" + fileUri.fsPath + entryName);
        this.children = children;
    }

    private static sliceLabelFromEntryName(entryName: string) {
        let index = entryName.lastIndexOf("/");
        
        return index || entryName.startsWith("/") ? entryName.slice(index + 1) : entryName;
    }

    getChildren(): ArchiveEntry[] {
        return this.children;
    }
}

export class Parser {
    private static fileSuffix = ".zip";

    public static canParse(uri:Uri) : boolean {
        return uri.fsPath.endsWith(Parser.fileSuffix);
    }

    zip: AdmZip;
    uri: Uri;
    str_to_entry: Map<string, IZipEntry> = new Map;
    str_to_child_strings: Map<string, Set<string>> = new Map;

    constructor(file: Uri) {
        this.uri = file;
        this.zip = new AdmZip(file.fsPath);
        let entries = this.zip.getEntries();

        entries.forEach(entry => {
            this.str_to_entry.set(entry.entryName, entry);
            this.parseEntry(entry.entryName);
        });

    }

    public parse(): ZipEntry {
        let result = new ZipEntry("", null, this.uri, this.parseChildren("/"));
        result.label = this.sliceNameFromUri();
        return result;
    }

    private sliceNameFromUri(): string {
        let fsString = this.uri.fsPath.toString();
        return fsString.slice(fsString.lastIndexOf(sep) + 1);
    }



    private parseChildren(entryName: string): ZipEntry[] {
        let result: ZipEntry[] = [];

        let childStrings = this.str_to_child_strings.get(entryName);

        childStrings?.forEach(string => {
            let entry: IZipEntry | undefined | null = this.str_to_entry.get(string);
            if (!entry) { entry = null; }
            result.push(new ZipEntry("/" + string, entry, this.uri, this.parseChildren(string)));
        });

        return result;
    }

    private parseEntry(entryName: string): void {
        let wip = entryName;

        if (entryName.endsWith("/")) {
            wip = entryName.slice(0, entryName.length - 1);
        }

        let strings = wip.split("/");

        let cumulativeString;
        let oldCumulativeString;

        for (let index = strings.length - 1; index >= 0; index--) {
            cumulativeString = strings.slice(0, index + 1).join("/");

            if (!this.str_to_child_strings.has(cumulativeString)) {
                this.str_to_child_strings.set(cumulativeString, new Set);
                if (oldCumulativeString) { this.str_to_child_strings.get(cumulativeString)?.add(oldCumulativeString); }
            } else {
                if (oldCumulativeString) { this.str_to_child_strings.get(cumulativeString)?.add(oldCumulativeString); }
                return;
            }
            oldCumulativeString = cumulativeString;
        }

        if (!this.str_to_child_strings.has("/")) {
            this.str_to_child_strings.set("/", new Set);
        }

        this.str_to_child_strings.get("/")?.add(strings[0]);
    }

}