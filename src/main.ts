import {Plugin, TFile} from 'obsidian';
import ProcessAllFilesCommand from "./Commands/ProcessAllFilesCommand";
import ProcessCurrentFileCommand from "./Commands/ProcessCurrentFileCommand";
import {DEFAULT_SETTINGS, Settings, SettingsProvider} from "./Settings";
import {SettingTab} from "./Settings/SettingsTab";
import FolderNoteBacklinkProcessor from "./Vault/FolderNoteBacklinkProcessor";
import {findFirstExistingFolderFromPath} from "./Vault/helpers";

export default class FolderNotesBacklinkPlugin extends Plugin implements SettingsProvider {
	settings: Settings;
	folderNoteBacklinkProcessor = new FolderNoteBacklinkProcessor(this.app, this);

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand(new ProcessAllFilesCommand(this.folderNoteBacklinkProcessor, this.app.vault));
		this.addCommand(new ProcessCurrentFileCommand(this.folderNoteBacklinkProcessor));

		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (file instanceof TFile) {
					this.folderNoteBacklinkProcessor.processFile(file);
				}
			})
		);

		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				// Deleted files have parent set to null and path set to the original value before delete.
				// Folder extracted here will be the first existing folder in the hierarchy or the root
				// if none was found.
				const folder = findFirstExistingFolderFromPath(this.app, file.path);
				this.folderNoteBacklinkProcessor.processFolderRecursively(folder);
			})
		);

		this.app.workspace.onLayoutReady(() => {
			this.registerEvent(
				this.app.vault.on("create", (file) => {
					if (file instanceof TFile) {
						this.folderNoteBacklinkProcessor.processFile(file);
					}
				})
			);
		});
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
