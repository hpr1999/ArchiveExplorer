import { Uri } from "vscode";
import { ArchiveEntry } from "./ArchiveEntry";
import { ZipParser } from "./ZipParser";

export class RootCreator {
    
    public static createArchiveRoot(uri: Uri): ArchiveEntry | undefined {
        if (ZipParser.canParse(uri)) {
            return new ZipParser(uri).parse();
        }
    }

}