import {Plugin, TFile} from 'obsidian';
import FolderNoteBacklinkManager from "./folderNoteBacklinkManager";
import {initClosestFolder, initFolder, isFolderNote} from "./helpers";
import {DEFAULT_SETTINGS, FolderNotesBacklinkPluginSettings, SettingTab} from "./settings";

export default class FolderNotesBacklinkPlugin extends Plugin {
	settings: FolderNotesBacklinkPluginSettings;
	manager: FolderNoteBacklinkManager;

	async onload() {
		await this.loadSettings();
		this.loadServices();

		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: 'process-all-files',
			name: 'Process folder note backlinks in all files',
			callback: () => {
				const root = initFolder(this.app.vault.getRoot());
				this.manager.process(root);
			}
		});

		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (isFolderNote(file)) {
					const folder = initFolder(file);
					this.manager.process(folder);
				} else if (file instanceof TFile) {
					const folder = initFolder(file);
					this.manager.setProperty(file, folder.folderNote);
				}
			})
		);

		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				const folder = initClosestFolder(this.app, file.path);
				this.manager.process(folder);
			})
		);

		this.app.workspace.onLayoutReady(() => {
			this.registerEvent(
				this.app.vault.on("create", (file) => {
					if (isFolderNote(file)) {
						const folder = initFolder(file);
						this.manager.process(folder);
					} else if (file instanceof TFile) {
						const folder = initFolder(file);
						this.manager.setProperty(file, folder.folderNote);
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
		this.loadServices();
	}

	private loadServices(): void {
		this.manager = new FolderNoteBacklinkManager(this.app, this.settings.propertyName);
	}
}
