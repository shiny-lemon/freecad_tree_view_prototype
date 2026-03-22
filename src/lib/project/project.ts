import { type Document } from './document';

export interface Project {
	name: string;
	documents: Document[];
	_selectedId: string | null;
	selected: Document | null;
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
		}
	};
	return project;
};
