import {App, PluginSettingTab, Setting} from "obsidian";
import FolderNotesBacklinkPlugin from "./main";

export interface FolderNotesBacklinkPluginSettings {
	propertyName: string;
}

export const DEFAULT_SETTINGS: FolderNotesBacklinkPluginSettings = {
	propertyName: 'parent'
}

export class SettingTab extends PluginSettingTab {
	plugin: FolderNotesBacklinkPlugin;

	constructor(app: App, plugin: FolderNotesBacklinkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Property name')
			.setDesc('The name of the backlink property')
			.addText(text => text
				.setValue(this.plugin.settings.propertyName)
				.onChange(async (value) => {
					this.plugin.settings.propertyName = value;
					await this.plugin.saveSettings();
				}));
	}
}
