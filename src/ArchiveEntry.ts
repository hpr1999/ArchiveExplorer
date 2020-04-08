import { TreeItem } from "vscode";

export interface ArchiveEntry extends TreeItem {
    getChildren(): ArchiveEntry[];
}

export interface Archive extends ArchiveEntry {
}
