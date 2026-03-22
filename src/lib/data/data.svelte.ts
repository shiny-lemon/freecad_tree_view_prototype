import { newAssembly, newPart, type Part } from '$lib/project/document';
import { insert, seek } from '$lib/project/entry';
import { feature, featureType, type Feature } from '$lib/project/feature';
import { newProject, type Project } from '$lib/project/project';

const thumbnail = async (name: string) =>
	/* @vite-ignore */
	(await import(`$lib/assets/thumbnails/${name}.png`)).default;

// Initialization of project
const initialProject = newProject('Excavator Arm');

const parts: Part[] = [];

// BASE
const partBase = newPart('Base', await thumbnail('Base'));

insert(feature(featureType.PAD, 'Pad Profile'), partBase.features);
insert(feature(featureType.SKETCH, 'Sketch Profile'), seek(partBase.features).children);

insert(feature(featureType.POCKET, 'Pocket Negative'), partBase.features);
insert(feature(featureType.SKETCH, 'Sketch Negative'), seek(partBase.features).children);

insert(feature(featureType.PAD, 'Pad Cylinder Holder'), partBase.features);
insert(feature(featureType.SKETCH, 'Sketch Cylinder Holder'), seek(partBase.features).children);
insert(feature(featureType.LINEAR, 'Linear Pattern Cylinder Holder'), partBase.features);

insert(feature(featureType.PAD, 'Pad Arm Holder'), partBase.features);
insert(feature(featureType.SKETCH, 'Sketch Arm Holder'), seek(partBase.features).children);
insert(feature(featureType.LINEAR, 'Linear Pattern Arm Holder'), partBase.features);

parts.push(partBase);

// BOOM
parts.push(newPart('Boom', await thumbnail('Boom')));

// BASE_PIN
parts.push(newPart('BasePin', await thumbnail('BasePin')));

// STICK
parts.push(newPart('Stick', await thumbnail('Stick')));

// BUCKET_LINK_1
parts.push(newPart('BucketLink1', await thumbnail('BucketLink1')));

// BUCKET_LINK_2
parts.push(newPart('BucketLink2', await thumbnail('BucketLink2')));

// BUCKET
parts.push(newPart('Bucket', await thumbnail('Bucket')));

// CYLINDERS
parts.push(newPart('BoomCylinderInner', await thumbnail('Cylinder')));
parts.push(newPart('StickCylinderInner', await thumbnail('Cylinder')));
parts.push(newPart('BucketCylinderInner', await thumbnail('Cylinder')));

parts.push(newPart('BoomCylinderInner', await thumbnail('Cylinder')));
parts.push(newPart('StickCylinderInner', await thumbnail('Cylinder')));
parts.push(newPart('BucketCylinderInner', await thumbnail('Cylinder')));

// ASSEMBLY
initialProject.documents.push(...parts);
initialProject.documents.push(newAssembly('Assembly', parts, await thumbnail('Assembly')));

// Temporary features
const features: Feature[] = [];
insert(feature(featureType.PAD, 'Pad001'), features);
insert(feature(featureType.SKETCH, 'Sketch001'), seek(features).children);
insert(feature(featureType.REVOLVE, 'Revolve001'), features);
insert(feature(featureType.SKETCH, 'Sketch002'), seek(features).children);

// External project
export const project: Project = $state(initialProject);

project.selected = parts[0];
