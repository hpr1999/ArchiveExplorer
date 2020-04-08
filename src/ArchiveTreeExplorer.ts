import { TreeDataProvider, TreeItem, Event, ProviderResult, EventEmitter } from 'vscode';
import { ArchiveEntry } from './ArchiveEntry';

export class ArchiveTreeExplorer implements TreeDataProvider<ArchiveEntry> {

    root?: undefined | ArchiveEntry;

    private _onDidChangeTreeData: EventEmitter<ArchiveEntry | undefined> = new EventEmitter<ArchiveEntry | undefined>();
    readonly onDidChangeTreeData: Event<ArchiveEntry | undefined> = this._onDidChangeTreeData.event;

    public setRoot(archive: ArchiveEntry | undefined) {
        this.root = archive;
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: ArchiveEntry): ArchiveEntry {
        return element;
    }
    getChildren(element?: ArchiveEntry | undefined): ArchiveEntry[] | undefined {
        return element?.getChildren() || this.root?.getChildren();
    }

}