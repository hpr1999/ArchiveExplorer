import { TreeDataProvider, TreeItem, Event, ProviderResult, EventEmitter } from 'vscode';
import { ArchiveEntry } from './ArchiveEntry';

export class ArchiveTreeExplorer implements TreeDataProvider<ArchiveEntry> {

    root: Set<ArchiveEntry> = new Set;

    private _onDidChangeTreeData: EventEmitter<ArchiveEntry | undefined> = new EventEmitter<ArchiveEntry | undefined>();
    readonly onDidChangeTreeData: Event<ArchiveEntry | undefined> = this._onDidChangeTreeData.event;

    public addRoot(archive: ArchiveEntry) {
        this.root.add(archive);
        this._onDidChangeTreeData.fire(undefined);
    }

    public removeRoot(archive: ArchiveEntry) {
        this.root.delete(archive);
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: ArchiveEntry): ArchiveEntry {
        return element;
    }
    getChildren(element?: ArchiveEntry | undefined): ArchiveEntry[] | undefined {
        if (element) { return element.getChildren(); }
        if (this.root) { return Array.from(this.root); }
    }

}