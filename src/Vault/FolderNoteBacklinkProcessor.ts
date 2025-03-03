import {App, TAbstractFile, TFile, TFolder} from "obsidian";
import {SettingsProvider} from "../Settings";
import Folder from "./Folder";

export default class FolderNoteBacklinkProcessor {
	constructor(
		private readonly app: App,
		private readonly settingsProvider: SettingsProvider,
	) {
	}

	async processFile(file: TFile) {
		if (Folder.isFolderNote(file)) {
			const folder = this.createFolderFromAbstractFile(file);
			await this.doProcessFolder(folder);
		} else {
			const folder = this.createFolderFromAbstractFile(file);
			await this.setProperty(file, folder.folderNote);
		}
	}

	async processFolderRecursively(folder: TFolder) {
		await this.doProcessFolder(
			this.createFolderFromAbstractFile(folder)
		);
	}

	private async doProcessFolder(folder: Folder) {
		if (folder.folderNote) {
			await this.setProperty(folder.folderNote, folder.folderNoteFromParent);
			folder.subNotes.forEach(note => this.setProperty(note, folder.folderNote));
		}

		folder.subFolders.forEach(folder => this.doProcessFolder(folder));
	}

	private async setProperty(file: TFile, target: TFile|null) {
		const propertyName = this.settingsProvider.settings.propertyName;

		if (target) {
			const link = this.app.fileManager.generateMarkdownLink(target, file.path);
			await this.app.fileManager.processFrontMatter(file, frontMatter => {
				frontMatter[propertyName] = link;
				return frontMatter;
			});
		} else {
			await this.app.fileManager.processFrontMatter(file, frontMatter => {
				delete frontMatter[propertyName];
				return frontMatter;
			});
		}
	}

	private createFolderFromAbstractFile(file: TAbstractFile): Folder {
		if (file instanceof TFolder) {
			return new Folder(file);
		}

		if (file.parent) {
			return new Folder(file.parent);
		}

		return new Folder(this.app.vault.getRoot());
	}
}
