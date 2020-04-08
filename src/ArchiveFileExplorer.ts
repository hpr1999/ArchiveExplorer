import { FileSystemProvider, Event, FileChangeEvent, Uri, Disposable, FileStat, FileType, EventEmitter } from "vscode";

export class ArchiveFileExplorer implements FileSystemProvider {
    _onDidChangeFile: EventEmitter<FileChangeEvent[]> = new EventEmitter();
    onDidChangeFile: Event<FileChangeEvent[]> = this._onDidChangeFile.event;

    watch(uri: Uri, options: { recursive: boolean; excludes: string[]; }): Disposable {
        throw new Error("Method not implemented.");
    }
    stat(uri: Uri): FileStat | Thenable<FileStat> {
        throw new Error("Method not implemented.");
    }
    readDirectory(uri: Uri): [string, FileType][] | Thenable<[string, FileType][]> {
        throw new Error("Method not implemented.");
    }
    createDirectory(uri: Uri): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
    readFile(uri: Uri): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }
    writeFile(uri: Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
    delete(uri: Uri, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
    rename(oldUri: Uri, newUri: Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

}