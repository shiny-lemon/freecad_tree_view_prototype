import { documentType, newDocument, type Document } from '$lib/project/document';
import { createEntry, entryType, insert, positionRelation, type Entry } from '$lib/project/entry';
import { newProject, type Project } from '$lib/project/project';
import { runTransactions, type Transaction } from '$lib/project/transaction';

const thumbnail = async (name: string) =>
	/* @vite-ignore */
	(await import(`$lib/assets/thumbnails/${name}.png`)).default;

// Initialization of project
const initialProject = newProject('Excavator Arm');

const documents: Document[] = [];

// BASE
const partBase = newDocument(documentType.PART, 'Base', await thumbnail('Base'));

const partBaseTransaction: Transaction = (entries) => {
	const entriesStack = [entries];

	const last = (entriesStack: Entry[][]) => entriesStack.at(-1) as Entry[]
	const sketchParentAt = (id: string) => { return { pathIds: [id], relation: positionRelation.AFTER, in: true } }

	// Profile
	const padProfile = createEntry(entryType.PAD, "Pad Profile")
	entriesStack.push(insert(last(entriesStack), padProfile));

	const sketchPadProfile = createEntry(entryType.SKETCH, "Sketch Profile", false)
	entriesStack.push(insert(last(entriesStack), sketchPadProfile, sketchParentAt(padProfile.id)))

	// Negative
	const pocketNegative = createEntry(entryType.POCKET, "Pocket Negative")
	entriesStack.push(insert(last(entriesStack), pocketNegative));

	const sketchNegative = createEntry(entryType.SKETCH, "Sketch Negative", false)
	entriesStack.push(insert(last(entriesStack), sketchNegative, sketchParentAt(pocketNegative.id)))

	// Cylinder Holder
	const padCylinderHolder = createEntry(entryType.PAD, "Pad Cylinder Holder")
	entriesStack.push(insert(last(entriesStack), padCylinderHolder));

	const sketchCylinderHolder = createEntry(entryType.SKETCH, "Sketch Cylinder Holder", false)
	entriesStack.push(insert(last(entriesStack), sketchCylinderHolder, sketchParentAt(padCylinderHolder.id)))

	const linearCylinderHolder = createEntry(entryType.LINEAR, "Linear Pattern Cylinder Holder", false)
	entriesStack.push(insert(last(entriesStack), linearCylinderHolder));

	// Arm Holder
	const padArmHolder = createEntry(entryType.PAD, "Pad Arm Holder")
	entriesStack.push(insert(last(entriesStack), padArmHolder));

	const sketchArmHolder = createEntry(entryType.SKETCH, "Sketch Arm Holder", false)
	entriesStack.push(insert(last(entriesStack), sketchArmHolder, sketchParentAt(padArmHolder.id)))

	const linearArmHolder = createEntry(entryType.LINEAR, "Linear Pattern Arm Holder", false)
	entriesStack.push(insert(last(entriesStack), linearArmHolder));

	return last(entriesStack);
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
initialProject.documents.push(newDocument(documentType.ASSEMBLY, 'Assembly', await thumbnail('Assembly')));

// External project
export const project: Project = $state(initialProject);

project.selected = documents[0];
