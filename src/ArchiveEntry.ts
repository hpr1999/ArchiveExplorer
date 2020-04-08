import { TreeItem, Uri, TreeItemCollapsibleState, workspace } from "vscode";

export interface ArchiveEntry extends TreeItem {
    getChildren(): ArchiveEntry[];
}

export interface Archive extends ArchiveEntry {
}
