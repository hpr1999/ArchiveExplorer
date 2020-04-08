import { ArchiveEntry, Archive } from "./ArchiveEntry";
import { TreeItem, TreeItemCollapsibleState } from "vscode";

export class ZipEntry extends TreeItem implements ArchiveEntry {

    private children: ZipEntry[];

    constructor(label: string, collapsible: TreeItemCollapsibleState, children: ZipEntry[]) {
        super(label, collapsible);
        this.children = children;
    }

    getChildren(): ArchiveEntry[] {
        return this.children;
    }

}

export class ZipFile extends ZipEntry implements Archive {

    constructor(label: string, children: ZipEntry[]) {
        super(label,TreeItemCollapsibleState.Expanded,children);
    }
}