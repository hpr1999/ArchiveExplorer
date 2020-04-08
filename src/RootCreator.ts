import { Uri } from "vscode";
import { ArchiveEntry } from "./ArchiveEntry";
import { Parser } from "./ZipEntry";

export class RootCreator {
    
    public static createArchiveRoot(uri: Uri): ArchiveEntry | undefined {
        if (Parser.canParse(uri)) {
            return new Parser(uri).parse();
        }
    }

}