import { documentType, newDocument, type Document } from '$lib/project/document';
import { createEntry, entryType, insert, positionRelation, type Entry, type PositionRelation } from '$lib/project/entry';
import { newProject, type Project } from '$lib/project/project';
import { runTransactions, type Transaction } from '$lib/project/transaction';

const thumbnail = async (name: string) =>
	(await import(`$lib/assets/thumbnails/${name}.png`)).default;

// Initialization of project
const initialProject = newProject('Excavator Arm');

const documents: Document[] = [];

// BASE
const partBase = newDocument(documentType.PART, 'Base', await thumbnail('Base'));

const partBaseTransaction: Transaction = (entries) => {
	let newEntries: Entry[] = [];

	const inParent = (id: string) => { return { pathIds: [id], relation: positionRelation.AFTER, in: true } }

	// Profile
	const padProfile = createEntry(entryType.PAD, "Pad Profile")
	newEntries = insert(newEntries, padProfile);

	const sketchPadProfile = createEntry(entryType.SKETCH, "Sketch Profile", false)
	newEntries = insert(newEntries, sketchPadProfile, inParent(padProfile.id))

	// Negative
	const pocketNegative = createEntry(entryType.POCKET, "Pocket Negative")
	newEntries = insert(newEntries, pocketNegative);

	const sketchNegative = createEntry(entryType.SKETCH, "Sketch Negative", false)
	newEntries = insert(newEntries, sketchNegative, inParent(pocketNegative.id))

	// Cylinder Holder
	const padCylinderHolder = createEntry(entryType.PAD, "Pad Cylinder Holder")
	newEntries = insert(newEntries, padCylinderHolder);

	const sketchCylinderHolder = createEntry(entryType.SKETCH, "Sketch Cylinder Holder", false)
	newEntries = insert(newEntries, sketchCylinderHolder, inParent(padCylinderHolder.id))

	const linearCylinderHolder = createEntry(entryType.LINEAR, "Linear Pattern Cylinder Holder", false)
	newEntries = insert(newEntries, linearCylinderHolder);

	// Arm Holder
	const padArmHolder = createEntry(entryType.PAD, "Pad Arm Holder")
	newEntries = insert(newEntries, padArmHolder);

	const sketchArmHolder = createEntry(entryType.SKETCH, "Sketch Arm Holder", false)
	newEntries = insert(newEntries, sketchArmHolder, inParent(padArmHolder.id))

	const linearArmHolder = createEntry(entryType.LINEAR, "Linear Pattern Arm Holder", false)
	newEntries = insert(newEntries, linearArmHolder);

	return [...entries, ...newEntries];
}

partBase.entries = runTransactions(partBase.entries, [partBaseTransaction])

documents.push(partBase);

// BOOM
documents.push(newDocument(documentType.PART, 'Boom', await thumbnail('Boom')));

// BASE_PIN
documents.push(newDocument(documentType.PART, 'BasePin', await thumbnail('BasePin')));

// STICK
documents.push(newDocument(documentType.PART, 'Stick', await thumbnail('Stick')));

// BUCKET_LINK_1
documents.push(newDocument(documentType.PART, 'BucketLink1', await thumbnail('BucketLink1')));

// BUCKET_LINK_2
documents.push(newDocument(documentType.PART, 'BucketLink2', await thumbnail('BucketLink2')));

// BUCKET
documents.push(newDocument(documentType.PART, 'Bucket', await thumbnail('Bucket')));

// CYLINDERS
documents.push(newDocument(documentType.PART, 'BoomCylinderInner', await thumbnail('Cylinder')));
documents.push(newDocument(documentType.PART, 'StickCylinderInner', await thumbnail('Cylinder')));
documents.push(newDocument(documentType.PART, 'BucketCylinderInner', await thumbnail('Cylinder')));

documents.push(newDocument(documentType.PART, 'BoomCylinderInner', await thumbnail('Cylinder')));
documents.push(newDocument(documentType.PART, 'StickCylinderInner', await thumbnail('Cylinder')));
documents.push(newDocument(documentType.PART, 'BucketCylinderInner', await thumbnail('Cylinder')));

// ASSEMBLY
initialProject.documents.push(...documents);

const assemblyDocument = newDocument(documentType.ASSEMBLY, 'Assembly', await thumbnail('Assembly'));

initialProject.documents.push(assemblyDocument);

// External project
export const project: Project = $state(initialProject);

project.selected = documents[0];

// All the bad stuff (mutation, side-effects, etc.) enclosed in here (and only here - hopefully!) for transaction logic
export const addTransaction = (documentId: string, transaction: Transaction) => {
	const document = project.documents.find((value) => value.id === documentId);
	if (document === undefined) throw new Error(`Could not find document with id ${documentId}`)
	document.entries = transaction(document.entries);
	return document
}