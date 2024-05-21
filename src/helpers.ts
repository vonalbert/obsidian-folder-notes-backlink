import {App, TAbstractFile, TFile, TFolder} from "obsidian";
import Folder from "./folder";

export function initFolder(file: TAbstractFile): Folder {
	if (file instanceof TFolder) {
		return new Folder(file);
	}

	if (file.parent) {
		return new Folder(file.parent);
	}

	return new Folder(file.vault.getRoot());
}

export function initClosestFolder(app: App, path: string): Folder {
	const obsidianFolder = getFirstExistingFolderFromPath(app, path);
	return initFolder(obsidianFolder);
}

export function getFirstExistingFolderFromPath(app: App, path: string): TFolder {
	if (path.length === 0) {
		return app.vault.getRoot();
	}

	const folder = app.vault.getFolderByPath(path);
	if (folder instanceof TFolder) {
		return folder;
	}

	return getFirstExistingFolderFromPath(app, path.substring(0, path.lastIndexOf('/')));
}

export function isFolderNote(file: TAbstractFile): boolean {
	return file instanceof TFile && Folder.isFolderNote(file);
}
