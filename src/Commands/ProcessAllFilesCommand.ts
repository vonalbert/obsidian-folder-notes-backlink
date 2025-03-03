import {Command, Vault} from "obsidian";
import FolderNoteBacklinkProcessor from "../Vault/FolderNoteBacklinkProcessor";

export default class ProcessAllFilesCommand implements Command {
	readonly id = 'process-all-files';
	readonly name = 'Process folder note backlinks in all files';

	constructor(
		private readonly backlinkProcessor: FolderNoteBacklinkProcessor,
		private readonly vault: Vault,
	) {
	}

	callback() {
		this.backlinkProcessor.processFolderRecursively(
			this.vault.getRoot()
		);
	}
}
