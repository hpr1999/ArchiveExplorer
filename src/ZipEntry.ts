import * as AdmZip from "adm-zip";
import { IZipEntry } from "adm-zip";
import { Uri, TreeItem, TreeItemCollapsibleState } from "vscode";
import { ArchiveEntry } from "./ArchiveEntry";

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

