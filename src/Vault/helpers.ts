import {App, TFolder} from "obsidian";

export function findFirstExistingFolderFromPath(app: App, path: string): TFolder {
	if (path.length === 0) {
		return app.vault.getRoot();
	}

	const folder = app.vault.getFolderByPath(path);
	if (folder instanceof TFolder) {
		return folder;
	}

	return findFirstExistingFolderFromPath(app, path.substring(0, path.lastIndexOf('/')));
}
