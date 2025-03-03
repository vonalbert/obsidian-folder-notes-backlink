import {Command, Editor, MarkdownFileInfo, MarkdownView} from "obsidian";
import FolderNoteBacklinkProcessor from "../Vault/FolderNoteBacklinkProcessor";

export default class ProcessCurrentFileCommand implements Command {
	readonly id = 'process-current-files';
	readonly name = 'Process current file';

	constructor(
		private readonly backlinkProcessor: FolderNoteBacklinkProcessor,
	) {
	}

	editorCheckCallback(checking: boolean, editor: Editor, ctx: MarkdownView | MarkdownFileInfo) {
		const currentFile = ctx.file;

		if (!currentFile) {
			return false;
		}

		if (checking) {
			return true;
		}

		this.backlinkProcessor.processFile(currentFile);
	}
}
