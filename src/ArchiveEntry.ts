import { TreeItem } from "vscode";

export interface ArchiveEntry extends TreeItem {
    getChildren(): ArchiveEntry[];
}

