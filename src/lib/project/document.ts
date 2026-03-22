import { Box, Drill, House, type Icon, Link, StickyNote, Table2 } from '@lucide/svelte';
import {
	featureCategory,
	isDressUpType,
	isModelingType,
	isPatternType,
	isSketchType,
	type Feature,
	type FeatureCategory
} from './feature';
import type { Joint } from './joint';
import { folder, partEntryType, type Entry, type PartEntry } from './entry.ts';

export const documentType = {
	PART: 'part',
	ASSEMBLY: 'assembly',
	BIM: 'bim',
	CAM: 'cam',
	TECH_DRAW: 'tech-draw',
	VAR_SET: 'var-set'
} as const;

export const displayType = (type: DocumentType): string => {
	switch (type) {
		case documentType.PART:
			return 'Part';
		case documentType.ASSEMBLY:
			return 'Assembly';
		case documentType.BIM:
			return 'BIM';
		case documentType.CAM:
			return 'CAM';
		case documentType.TECH_DRAW:
			return 'TechDraw';
		case documentType.VAR_SET:
			return 'VarSet';
		default:
			const unhandledType: never = type;
			throw new Error(`Unhandled type case: ${unhandledType}`);
	}
};

export const documentTypeWorkbenches: Record<DocumentType, string[]> = {
	[documentType.PART]: ['Part Design', 'Sketcher', 'Surface'],
	[documentType.ASSEMBLY]: ['Assembly', 'FEM'],
	[documentType.BIM]: ['BIM'],
	[documentType.CAM]: ['CAM'],
	[documentType.TECH_DRAW]: ['TechDraw'],
	[documentType.VAR_SET]: []
} as const;

export type DocumentType = (typeof documentType)[keyof typeof documentType];

// TODO Help! I have absolutely no idea how to make this type equivalent to what
type FilterPredicate<T> = (value: T, index: number, array: T[]) => unknown;
// ENDED HERE LAST TIME
// So I basically want the end-api to not care about the filter function
// It should only need to supply a type of a document (e.g. joints in Assembly, sketches, in Part)
// And then we filter it here
// How should types work for that?
// No idea
// Probably need a type dependend on some thing
// So Document (interface) might need to be generic to accomendate that
// ??
type EntriesFunction = (filterType?: unknown) => Entry[];

export interface Document {
	id: string;
	name: string;
	type: DocumentType;
	thumbnail: string | null;
	entries: EntriesFunction;
}

export interface Assembly extends Document {
	parts: Part[];
	joints: Joint[];
}

export interface Part extends Document {
	features: Feature[];
}

const newDocument = (name: string, type: DocumentType, thumbnail?: string): Document => {
	const document: Document = {
		id: crypto.randomUUID(),
		name,
		type,
		thumbnail: thumbnail ?? null,
		entries: () => []
	};

	return document;
};

export const partFilterFunctions: Record<FeatureCategory, FilterPredicate<Feature>> = {
	[featureCategory.ANY]: () => true,
	[featureCategory.SKETCH]: ({ type }) => isSketchType(type),
	[featureCategory.MODELING]: ({ type }) => isModelingType(type),
	[featureCategory.PATTERN]: ({ type }) => isPatternType(type),
	[featureCategory.DRESS_UP]: ({ type }) => isDressUpType(type)
} as const;

export const newPart = (name: string, thumbnail?: string): Part => {
	const features: Feature[] = [];
	const document = {
		...newDocument(name, documentType.PART, thumbnail),

		entries(predicate) {
			if (!predicate) return this.features;

			const filteredEntries = this.features.filter(predicate);
			return filteredEntries;
		},

		features
	} satisfies Part;
	return document;
};

export const newAssembly = (name: string, parts: Part[], thumbnail?: string): Assembly => {
	const joints: Joint[] = [];
	const document = {
		...newDocument(name, documentType.ASSEMBLY, thumbnail),
		parts,
		joints,
		entries(predicate) {
			const jointsFolder = folder('Joints');
			jointsFolder.children = this.joints;
			const partsEntries: PartEntry[] = this.parts.map(({ name }) => {
				return { id: crypto.randomUUID(), type: partEntryType, name };
			});

			const entries = [jointsFolder, ...partsEntries] satisfies Entry[];
			if (!predicate) return entries;

			const filteredEntries = entries.filter(predicate);
			return filteredEntries;
		}
	} satisfies Assembly;
	return document;
};

export const documentIcon = (type: DocumentType): typeof Icon => {
	switch (type) {
		case documentType.PART:
			return Box;
		case documentType.ASSEMBLY:
			return Link;
		case documentType.BIM:
			return House;
		case documentType.CAM:
			return Drill;
		case documentType.TECH_DRAW:
			return Table2;
		case documentType.VAR_SET:
			return StickyNote;
		default:
			const unhandledType: never = type;
			throw new Error(`Unhandled type case: ${unhandledType}`);
	}
};
