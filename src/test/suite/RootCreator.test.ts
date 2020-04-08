import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as tempy from 'tempy';
import { RootCreator } from '../../RootCreator';
import {Parser} from  '../../ZipEntryNG';
import * as AdmZip from "adm-zip";

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let dir = tempy.directory();
	let zipFile = dir + "/zip.zip";

	let zip = new AdmZip();
	let content = "content";
	zip.addFile("test.txt", Buffer.alloc(content.length, content), "entry comment goes here");
	zip.addFile("test1/test.txt", Buffer.alloc(content.length, content), "entry comment goes here");
	zip.addFile("test1/test2/test.txt", Buffer.alloc(content.length, content), "entry comment goes here");
	zip.addFile("test2/test.txt", Buffer.alloc(content.length, content), "entry comment goes here");
	zip.writeZip(dir + "/zip.zip");

	let zipUri: vscode.Uri = vscode.Uri.file(zipFile);

	console.log(zipUri);

	let v = new Parser(zipUri).parse();

	test('ZipRootTest', () => {
		let root = RootCreator.createArchiveRoot(zipUri);
		let rootChildren = root?.getChildren();
		assert(rootChildren);
		if (rootChildren) {
			let test1 = rootChildren.filter(entry => entry.label === "test1");
			let test2 = rootChildren.filter(entry => entry.label === "test2");
			let test1test2 = test1[0].getChildren().filter(entry => entry.label === "test2");
			assert.equal(rootChildren.filter(entry => entry.label === "test.txt").length, 1);
			assert.equal(test1.length, 1);
			assert.equal(test2.length, 1);
			assert.equal(test1[0].getChildren().length, 2);
			assert.equal(test1test2.length, 1);
			assert.equal(test1test2[0].getChildren().length, 1);
			assert.equal(test1test2[0].getChildren()[0].label, "test.txt");
			assert.equal(test1[0].getChildren().filter(entry => entry.label === "test.txt").length, 1);
			assert.equal(test2[0].getChildren().length, 1);
			assert.equal(test2[0].getChildren()[0].label, "test.txt");
		}
	});
});
