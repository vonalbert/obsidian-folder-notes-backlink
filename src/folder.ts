import {TFile, TFolder} from "obsidian";

export default class Folder {
	private initialized: boolean = false;
	private _folderNoteFromParent: TFile|null;
	private _folderNote: TFile|null;
	private _subFolders: Array<Folder>;
	private _subNotes: Array<TFile>;

	constructor(
		public readonly folder: TFolder
	) {
	}

	get path() {
		return this.folder.path;
	}

	private initialize(): void {
		if (this.initialized) {
			return;
		}

		this.initialized = true;

		if (!this._folderNoteFromParent) {
			this._folderNoteFromParent = this.folder.parent ? Folder.searchParentFolderNotes(this.folder.parent) : null;
		}

		this._folderNote = null;
		this._subFolders = new Array<Folder>();
		this._subNotes = new Array<TFile>();

		for (let child of this.folder.children) {
			if (child instanceof TFolder) {
				this._subFolders.push(new Folder(child));
			} else if (child instanceof TFile) {
				if (Folder.isFolderNote(child)) {
					this._folderNote = child;
				} else {
					this._subNotes.push(child);
				}
			}
		}

		if (!this._folderNote) {
			this._folderNote = this._folderNoteFromParent;
		}

		this._subFolders.forEach(subFolder => {
			subFolder._folderNoteFromParent = this._folderNote;
		})
	}

	static searchParentFolderNotes(folder: TFolder): TFile|null {
		// Root cannot have a folder note
		if (folder.isRoot()) {
			return null;
		}

		// Iterate through children to retrieve the folder note
		for (let child of folder.children) {
			if (child instanceof TFile && Folder.isFolderNote(child)) {
				return child;
			}
		}

		// No folder-note found at this level: try with the parent recursively
		if (!folder.parent) {
			return null;
		}

		return Folder.searchParentFolderNotes(folder.parent);
	}

	static isFolderNote(file: TFile): boolean {
		return file.basename === file.parent?.name;
	}

	get folderNoteFromParent(): TFile|null {
		this.initialize();
		return this._folderNoteFromParent;
	}

	get folderNote(): TFile|null {
		this.initialize();
		return this._folderNote;
	}

	get subFolders(): Array<Folder> {
		this.initialize();
		return this._subFolders;
	}

	get subNotes(): Array<TFile> {
		this.initialize();
		return this._subNotes;
	}
}
