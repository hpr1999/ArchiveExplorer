import { ArchiveEntry, Archive } from "./ArchiveEntry";
import { TreeItem, Uri, TreeItemCollapsibleState, workspace } from "vscode";
import { sep } from "path";
import { ZipParser } from "./ZipParser";

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

        super(ZipFile.sliceNameFromUri(uri), TreeItemCollapsibleState.Expanded, ZipParser.createChildren(uri));
        this.uri = uri;
    }

    // TODO move
    private static sliceNameFromUri(uri: Uri): string {
        let fsString = uri.fsPath.toString();
        return fsString.slice(fsString.lastIndexOf(sep) + 1, fsString.lastIndexOf("."));
    }

    getUri(): Uri {
        return this.uri;
    }


}