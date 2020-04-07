import { Uri } from "vscode";
import { Archive } from "./ArchiveEntry";
import { ZipFile } from "./ZipEntry";

export class RootCreator {


    /**
     * createArchiveRoot
     */
    public static createArchiveRoot(uri: Uri): Archive | undefined {
        if (uri.fsPath.endsWith(ZipFile.fileSuffix)) {
            return new ZipFile(uri);
        }
    }

}