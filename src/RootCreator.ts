import { Uri } from "vscode";
import { Archive } from "./ArchiveEntry";
import { ZipFile } from "./ZipEntry";
import { ZipParser } from "./ZipParser";

export class RootCreator {


    /**
     * createArchiveRoot
     */
    public static createArchiveRoot(uri: Uri): Archive | undefined {
        if (uri.fsPath.endsWith(ZipParser.fileSuffix)) {
            return ZipParser.createZipFile(uri);
        }
    }

}