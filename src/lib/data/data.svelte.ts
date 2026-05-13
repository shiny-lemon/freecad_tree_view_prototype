import { documentType, entrySelectionType, newDocument, updateFocus, type Document, type DocumentId } from '$lib/project/document';
import { dragPosition, newDragState, type DragPosition } from '$lib/project/drag';
import { createEntry, entryType, insert, move, positionRelation, type Entry, type EntryId, type EntryType, type PositionRelation } from '$lib/project/entry';
import { getDocument as _getDocument, getEntry as _getEntry, newProject, type Project } from '$lib/project/project';

// Mutation versions of helper functions
export const getDocuments = () => project.documents;
export const getDocument = (id: DocumentId | null) => _getDocument(project.documents, id);
export const getSelected = () => getDocument(project.selectedId);
export const getEntry = (id: EntryId) => _getEntry(getSelected(), id);
export const getFilterFunction = (id: DocumentId) => getDocument(id).filterFunction

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
export const setDragOver = (id: EntryId, position: DragPosition) => {
	getSelected().drag.entry.lastHovered = id
	getSelected().drag.entry.lastPosition = position
};

export const setDragStart = (id: EntryId) => getSelected().drag.entry.lastDragged = id;

export const setDrop = (dragged: EntryId, hovered: EntryId) => {
	getSelected().drag.entry.lastDropped = dragged
	flushLastEntryDrag();
	moveEntry(dragged, hovered);
};

export const getEntryDragState = () => getSelected().drag.entry;
export const flushLastEntryDrag = () => {
	getSelected().drag.entry.lastHovered = null;
	getSelected().drag.entry.lastDragged = null;
};
export const moveEntry = (dragged: EntryId, hovered: EntryId) => {
	const selected = getSelected();
	const position = getEntryDragState().lastPosition;

	const isIn = position === dragPosition.CENTER;

	const relation = position === dragPosition.TOP ? positionRelation.BEFORE : positionRelation.AFTER

	selected.entries = move(selected.entries, dragged, {
		id: hovered,
		relation: relation,
		in: isIn
	});

	// Side-effect showing children when inserted into hovered entry.
	if (isIn) getEntry(hovered).showChildren = true
}

const thumbnail = async (name: string) =>
	(await import(`$lib/assets/thumbnails/${name}.png`)).default;

// Initialization of project
const initialProject = newProject('Excavator Arm');

const inParent = (id: string) => { return { id, relation: positionRelation.AFTER, in: true } }

const createEntryAndSketch = (type: EntryType, entryName: string, sketchName: string) => {
	const firstEntry = insert([], createEntry(type, entryName, true));

	return insert(firstEntry,
		createEntry(entryType.SKETCH, sketchName),
		inParent(firstEntry.at(-1)?.id as EntryId))[0]
}

// BASE
const partBase = newDocument(documentType.PART, 'Base', await thumbnail('Base'));
partBase.entries = [
	createEntryAndSketch(entryType.PAD, "Pad Profile", "Sketch Profile"),
	createEntryAndSketch(entryType.POCKET, "Pocket Negative", "Sketch Negative"),
	createEntryAndSketch(entryType.PAD, "Pad Cylinder Holder", "Sketch Cylinder Holder"),
	createEntry(entryType.LINEAR, "Linear Pattern Cylinder Holder"),
	createEntryAndSketch(entryType.PAD, "Pad Arm Holder", "Sketch Arm Holder"),
	createEntry(entryType.LINEAR, "Linear Pattern Arm Holder"),
];
addDocument(partBase, initialProject.documents);

// BOOM
addDocument(newDocument(documentType.PART, 'Boom', await thumbnail('Boom')), initialProject.documents);

// BASE_PIN
addDocument(newDocument(documentType.PART, 'BasePin', await thumbnail('BasePin')), initialProject.documents);

// STICK
addDocument(newDocument(documentType.PART, 'Stick', await thumbnail('Stick')), initialProject.documents);

// BUCKET_LINK_1
addDocument(newDocument(documentType.PART, 'BucketLink1', await thumbnail('BucketLink1')), initialProject.documents);

// BUCKET_LINK_2
addDocument(newDocument(documentType.PART, 'BucketLink2', await thumbnail('BucketLink2')), initialProject.documents);

// BUCKET
addDocument(newDocument(documentType.PART, 'Bucket', await thumbnail('Bucket')), initialProject.documents);

// CYLINDERS
addDocument(newDocument(documentType.PART, 'BoomCylinderInner', await thumbnail('Cylinder')), initialProject.documents);
addDocument(newDocument(documentType.PART, 'StickCylinderInner', await thumbnail('Cylinder')), initialProject.documents);
addDocument(newDocument(documentType.PART, 'BucketCylinderInner', await thumbnail('Cylinder')), initialProject.documents);

addDocument(newDocument(documentType.PART, 'BoomCylinderInner', await thumbnail('Cylinder')), initialProject.documents);
addDocument(newDocument(documentType.PART, 'StickCylinderInner', await thumbnail('Cylinder')), initialProject.documents);
addDocument(newDocument(documentType.PART, 'BucketCylinderInner', await thumbnail('Cylinder')), initialProject.documents);

// ASSEMBLY
const assemblyDocument = newDocument(documentType.ASSEMBLY, 'Assembly', await thumbnail('Assembly'));

addDocument(assemblyDocument, initialProject.documents);

// External project
export const project: Project = $state(initialProject);

focusDocument();