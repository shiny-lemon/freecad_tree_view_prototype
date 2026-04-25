import { type Document, type DocumentId } from './document';
import { type Range } from "./"

export interface Project {
	name: string;
	documents: Document[];

	// State
	_selectedId: string | null;
	selected: Document | null;
	focus: Range<DocumentId> | null;
}

export const newProject = (name: string): Project => {
	const project: Project = {
		name,
		documents: [],

		_selectedId: null,
		get selected() {
			return this.documents.find(({ id }) => id == this._selectedId) ?? null;
		},
		set selected(document) {
			if (document === null) this._selectedId = null;
			else this._selectedId = document?.id ?? null;
		},
		focus: null,
	};
	return project;
};

export const findDocument = (project: Project, id: string): Document => {
	const foundDocument = project.documents.find((value) => value.id === id)
	if (foundDocument === undefined) throw Error(`No document with ${id} exists.`)
	return structuredClone(foundDocument)
}

export const overwriteDocument = (project: Project, id: string, newValue: Document) => {
	const foundDocumentIndex = project.documents.findIndex((value) => value.id === id)
	if (foundDocumentIndex === -1) throw Error(`No document with ${id} exists.`)
	project.documents[foundDocumentIndex] = newValue;
}