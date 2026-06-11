import { move, positionRelation } from '$lib/project';
import { entrySelectionType, updateFocus, type Document, type DocumentId } from '$lib/project/document';
import { dragKey, dragPosition, dragType, type DragKey, type DragState, type DragType, type SetDragOver, type SetDragStart, type SetDrop } from '$lib/project/drag';
import { type Entry, type EntryCoordinates, type EntryId } from '$lib/project/entry';
import { getDocument as _getDocument, getEntry as _getEntry, type Project } from '$lib/project/project';
import { setupProject } from './setup';

// Mutation versions of helper functions
export const getDocuments = () => project.documents;
export const getDocument = (id: DocumentId | null) => _getDocument(project.documents, id);
export const getSelected = () => project.selectedId !== null ? getDocument(project.selectedId) : null;
const getSelectedOrError = () => getDocument(project.selectedId)
export const getEntry = (id: EntryId) => _getEntry(getSelectedOrError(), id);
export const getHistory = () => project.history;

export const selectDocument = (id = project.documents[0].id) => {
	// Makes sure id is valid.
	project.selectedId = getDocument(id).id;
}

export const blurDocumentSelection = () => project.selectedId = null;

export const setPinned = (id: DocumentId, value: Document["pinned"]) => getDocument(id).pinned = value

export const setShowChildren = (id: EntryId, value: Entry["showChildren"]) => getEntry(id).showChildren = value

export const setEntryFilterType = (id: DocumentId, value: Document["entryFilterType"]) => getDocument(id).entryFilterType = value

export const setEntryName = (id: EntryId, value: Entry["name"]) => getEntry(id).name = value

export const updateDocumentFocus = (id: EntryId) => updateFocus(getSelectedOrError(), id, entrySelectionType.SELECT)

export const pushHistory = (id: DocumentId) => getHistory().push(id);

export const getDocumentSearchValue = () => project.documentSearchValue;
export const setDocumentSearchValue = (value: string) => project.documentSearchValue = value;

export const resetToHome = () => {
	setDocumentSearchValue("");
	blurDocumentSelection();
}

// Dragging
export const setDragOver: SetDragOver<string> = (type, id, position) => {
	getDragState().lastHovered = { type, id, position }
};

export const setDragStart: SetDragStart<string> = (type, id) => getDragState().lastDragged = { type, id, dropped: false };

export const setDrop: SetDrop<string> = (type, dragged, hovered) => {
	getDragState().lastDragged = { type, id: dragged, dropped: true }


	if (type === dragType.ENTRY || type === dragType.PART) {
		moveDragElement(type, dragged, hovered);
	}

	flushLastDrag();
};

export const setTipAnchor = (value: EntryId | null) => getSelectedOrError().tipAnchor = value;

export const setEntryCoordinates = (id: EntryId, coordinates: EntryCoordinates) => getEntry(id).coordinates = coordinates

export const getDragState = () => getSelectedOrError().drag;

export const flushLastDrag = () => {
	getDragState().lastHovered = null
};
export const moveDragElement = (type: DragType, dragged: EntryId, hovered: EntryId) => {
	const selected = getSelectedOrError();
	const lastHovered = getDragState().lastHovered;

	if (lastHovered === null) throw new Error("No hovered state set.");

	const position = lastHovered.position

	const relation = position === dragPosition.TOP ? positionRelation.BEFORE : positionRelation.AFTER

	if (type === dragType.ENTRY) {
		const isIn = position === dragPosition.CENTER;

		selected.entries = move(selected.entries, dragged, {
			id: hovered,
			relation: relation,
			in: isIn
		});

		// Side-effect showing children when inserted into hovered entry.
		if (isIn) getEntry(hovered).showChildren = true
	}
	else if (type === dragType.PART) {
		project.documents = move<Document>(project.documents, dragged, {
			id: hovered,
			relation: relation,
			in: false
		});

	}

}

// External project
export const project: Project = $state(setupProject());

