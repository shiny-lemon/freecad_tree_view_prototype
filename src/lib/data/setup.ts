import { insert, positionRelation } from "$lib/project";
import { documentType, newDocument, type Document } from "$lib/project/document";
import { createEntry, entryType, type EntryId, type EntryType } from "$lib/project/entry";
import { newProject, type Project } from "$lib/project/project";

const inParent = (id: string) => { return { id, relation: positionRelation.AFTER, in: true } }

export const addDocument = (document: Document, scope: Document[]) => {
    scope.push(document);
}

const createEntryAndSketch = (type: EntryType, entryName: string, sketchName: string) => {
    const firstEntry = insert([], createEntry(type, entryName, true));

    return insert(firstEntry,
        createEntry(entryType.SKETCH, sketchName),
        inParent(firstEntry.at(-1)?.id as EntryId))[0]
}

export const setupProject = (): Project => {
    // Initialization of project
    const initialProject = newProject('Excavator Arm');

    // BASE
    const partBase = newDocument(documentType.PART, 'Base', 'Base');
    partBase.entries = [
        // TODO should probably be a global part mirror instead of this linear pattern stuff
        createEntryAndSketch(entryType.PAD, "Pad Profile", "Sketch Profile"),
        createEntryAndSketch(entryType.POCKET, "Pocket Negative", "Sketch Negative"),
        createEntryAndSketch(entryType.PAD, "Pad Cylinder Holder", "Sketch Cylinder Holder"),
        createEntry(entryType.LINEAR, "Linear Pattern Cylinder Holder"),
        createEntryAndSketch(entryType.PAD, "Pad Arm Holder", "Sketch Arm Holder"),
        createEntry(entryType.LINEAR, "Linear Pattern Arm Holder"),
    ];
    addDocument(partBase, initialProject.documents);

    // BOOM
    const partBoom = newDocument(documentType.PART, 'Boom', 'Boom');
    partBoom.entries = [
        createEntryAndSketch(entryType.PAD, "Pad Profile", "Sketch Profile"),
        createEntryAndSketch(entryType.POCKET, "Pocket Mounting Holes", "Sketch Mounting Holes"),
        createEntryAndSketch(entryType.PAD, "Pad Bridge", "Sketch Bridge"),
        createEntry(entryType.MIRROR, "Mirror Part")
    ]
    addDocument(partBoom, initialProject.documents)

    // BASE_PIN
    const partBasePin = newDocument(documentType.PART, 'BasePin', 'BasePin')
    partBasePin.entries = [
        createEntryAndSketch(entryType.PAD, "Pad Profile", "Sketch Profile"),
    ]
    addDocument(partBasePin, initialProject.documents);

    // STICK
    const partStick = newDocument(documentType.PART, 'Stick', 'Stick')
    partStick.entries = [
        createEntryAndSketch(entryType.PAD, "Pad Upper Arm", "Sketch Upper Arm"),
        createEntryAndSketch(entryType.POCKET, "Pocket Mounting Holes", "Sketch Mounting Holes"),
        createEntryAndSketch(entryType.PAD, "Pad Bridge", "Sketch Bridge"),
        createEntryAndSketch(entryType.PAD, "Pad Lower Arm", "Sketch Lower Arm"),
        createEntry(entryType.MIRROR, "Mirror Part")
    ]
    addDocument(partStick, initialProject.documents);

    // BUCKET_LINK_1
    const partBucketLink1 = newDocument(documentType.PART, 'BucketLink1', 'BucketLink1')
    partBucketLink1.entries = [
        createEntryAndSketch(entryType.PAD, "Pad Link Bridge", "Sketch Link Bridge"),
        createEntryAndSketch(entryType.PAD, "Pad Mounting Arm", "Sketch Mounting Arm"),
        createEntryAndSketch(entryType.PAD, "Pad Mount Edge", "Sketch Mount Edge"),
        createEntryAndSketch(entryType.POCKET, "Pocket Mounting Holes", "Sketch Mounting Holes"),
        createEntry(entryType.MIRROR, "Mirror Part")
    ]
    addDocument(partBucketLink1, initialProject.documents);

    // BUCKET_LINK_2
    const partBucketLink2 = newDocument(documentType.PART, 'BucketLink2', 'BucketLink2')
    addDocument(partBucketLink2, initialProject.documents);

    // BUCKET
    const partBucket = newDocument(documentType.PART, 'Bucket', 'Bucket')
    addDocument(partBucket, initialProject.documents);

    // CYLINDERS
    const partBoomCylinderInner = newDocument(documentType.PART, 'BoomCylinderInner', 'Cylinder')
    addDocument(partBoomCylinderInner, initialProject.documents);

    const partStickCylinderInner = newDocument(documentType.PART, 'StickCylinderInner', 'Cylinder')
    addDocument(partStickCylinderInner, initialProject.documents);

    const partBucketCylinderInner = newDocument(documentType.PART, 'BucketCylinderInner', 'Cylinder')
    addDocument(partBucketCylinderInner, initialProject.documents);

    // ASSEMBLY
    const assemblyDocument = newDocument(documentType.ASSEMBLY, 'Assembly', 'Assembly');
    assemblyDocument.entries = [
        createEntry(entryType.BODY, partBase.name),
        createEntry(entryType.FIXED, "Fixed Base"), // Need a ground joint
        createEntry(entryType.BODY, partBasePin.name),
        createEntry(entryType.REVOLUTE, "Revolute Base Pin"),
        createEntry(entryType.BODY, partBoom.name),
        createEntry(entryType.REVOLUTE, "Revolute Boom"),
        createEntry(entryType.BODY, partBoomCylinderInner.name),
        createEntry(entryType.SLIDER, "Slider Boom Cylinder Inner"),
        createEntry(entryType.CYLINDRICAL, "Cylindrical Boom Cylinder Inner"),
        createEntry(entryType.BODY, partStick.name),
        createEntry(entryType.REVOLUTE, "Revolute Stick Boom"),
        createEntry(entryType.BODY, partStickCylinderInner.name),
        createEntry(entryType.SLIDER, "Slider Stick Cylinder Inner"),
        createEntry(entryType.CYLINDRICAL, "Cylindrical Stick Cylinder Inner"),
        createEntry(entryType.BODY, partBucketCylinderInner.name),
        createEntry(entryType.SLIDER, "Slider Bucket Cylinder Inner"),
        createEntry(entryType.BODY, partBucketLink2.name),
        createEntry(entryType.REVOLUTE, "Revolute Bucket Link 2"),
        createEntry(entryType.BODY, partBucket.name),
        createEntry(entryType.REVOLUTE, "Revolute Bucket"),
        createEntry(entryType.BODY, partBucketLink1.name),
        createEntry(entryType.REVOLUTE, "Revolute Bucket Link 1"),
        createEntry(entryType.CYLINDRICAL, "Cylindrical Bucket Links"),
        createEntry(entryType.CYLINDRICAL, "Cylindrical Bucket Cylinder Inner"),


    ]
    addDocument(assemblyDocument, initialProject.documents);

    return initialProject
}
