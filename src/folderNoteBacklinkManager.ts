import {App, TFile} from "obsidian";
import Folder from "./folder";

export default class FolderNoteBacklinkManager {
	constructor(
		private readonly app: App,
		private readonly propertyName: string,
	) {
	}

	async process(folder: Folder) {
		if (folder.folderNote) {
			await this.setProperty(folder.folderNote, folder.folderNoteFromParent);
			folder.subNotes.forEach(note => this.setProperty(note, folder.folderNote));
		}

		folder.subFolders.forEach(folder => this.process(folder));
	}

	async setProperty(file: TFile, target: TFile|null) {
		if (target) {
			const link = this.app.fileManager.generateMarkdownLink(target, file.path);
			await this.app.fileManager.processFrontMatter(file, frontMatter => {
				frontMatter[this.propertyName] = link;
				return frontMatter;
			});
		} else {
			await this.app.fileManager.processFrontMatter(file, frontMatter => {
				delete frontMatter[this.propertyName];
				return frontMatter;
			});
		}
	}
}
