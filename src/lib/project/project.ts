import { type Document, type DocumentId } from './document';
import { type Range } from "./"
import { type Entry, type EntryId } from './entry';
import { flatten } from './drag';

export interface Project {
	name: string;
	documents: Document[];

	// State
	selectedId: string | null;
	focus: Range<DocumentId> | null;
}

export const newProject = (name: string): Project => {
	const project: Project = {
		name,
		documents: [],

		selectedId: null,
		focus: null,
	};
	return project;
};

export const overwriteDocument = (project: Project, id: string, newValue: Document) => {
	const foundDocumentIndex = project.documents.findIndex((value) => value.id === id)
	if (foundDocumentIndex === -1) throw Error(`No document with ${id} exists.`)
	project.documents[foundDocumentIndex] = newValue;
}

export const getSelectedId = (project: Project): DocumentId => {
	const id = project.selectedId;
	if (id === null) throw new Error("No document selected");
	return id;
}

const getElement = <TElement extends { id: string }>(elements: TElement[], id: string | null) => {
	if (id === null) throw Error("Given id is null.");
	const foundElement = elements.find((element) => element.id === id);
	if (foundElement === undefined) throw Error(`No element with ${id} exists in ${elements}.`)
	return foundElement;
}

export const getDocument = (documents: Document[], id: DocumentId | null): Document => {
	return getElement(documents, id);
}

export const getEntry = ({ entries }: Document, id: EntryId): Entry => {
	const flattenedEntries = flatten(entries)
	return getElement(flattenedEntries, id);
}

