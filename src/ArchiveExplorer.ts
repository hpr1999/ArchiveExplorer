import { TreeDataProvider, TreeItem, Event, ProviderResult, EventEmitter } from 'vscode';
import { ArchiveEntry, Archive } from './ArchiveEntry';
import { on } from 'cluster';

export class ArchiveExplorer implements TreeDataProvider<ArchiveEntry>  {

    root?: undefined | Archive;

    private _onDidChangeTreeData: EventEmitter<ArchiveEntry | undefined> = new EventEmitter<ArchiveEntry | undefined>();
	readonly onDidChangeTreeData: Event<ArchiveEntry | undefined> = this._onDidChangeTreeData.event;

    public setRoot(archive: Archive | undefined) {
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