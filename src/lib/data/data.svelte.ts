import { entrySelectionType, updateFocus, type Document, type DocumentId } from '$lib/project/document';
import { dragKey, dragPosition, dragType, move, positionRelation, type DragKey, type DragState, type DragType, type SetDragOver, type SetDragStart, type SetDrop } from '$lib/project/drag';
import { type Entry, type EntryCoordinates, type EntryId } from '$lib/project/entry';
import { getDocument as _getDocument, getEntry as _getEntry, type Project } from '$lib/project/project';
import { setupProject } from './setup';

// Mutation versions of helper functions
export const getDocuments = () => project.documents;
export const getDocument = (id: DocumentId | null) => _getDocument(project.documents, id);
export const getSelected = () => getDocument(project.selectedId);
export const getEntry = (id: EntryId) => _getEntry(getSelected(), id);

export const focusDocument = (id = project.documents[0].id) => {
	// Makes sure id is valid.
	project.selectedId = getDocument(id).id;
}

export const addDocument = (document: Document, scope = project.documents) => {
	scope.push(document);
}

export const setPinned = (id: DocumentId, value: Document["pinned"]) => getDocument(id).pinned = value

export const setShowChildren = (id: EntryId, value: Entry["showChildren"]) => getEntry(id).showChildren = value

export const setFilterFunction = (id: DocumentId, value: Document["filterFunction"]) => getDocument(id).filterFunction = value

export const setEntryName = (id: EntryId, value: Entry["name"]) => getEntry(id).name = value

export const updateDocumentFocus = (id: EntryId) => updateFocus(getSelected(), id, entrySelectionType.SELECT)

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

export const setTipAnchor = (value: EntryId | null) => getSelected().tipAnchor = value;

export const setEntryCoordinates = (id: EntryId, coordinates: EntryCoordinates) => getEntry(id).coordinates = coordinates

export const getDragState = () => getSelected().drag;

export const flushLastDrag = () => {
	getDragState().lastHovered = null
};
export const moveDragElement = (type: DragType, dragged: EntryId, hovered: EntryId) => {
	const selected = getSelected();
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
export const project: Project = $state(await setupProject());

focusDocument();