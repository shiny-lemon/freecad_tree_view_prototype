import { entryCategory, entryFilter, entryFilterFunction, entryTypeCategory, type Entry, type EntryCategory, type EntryFilter, type EntryId, type EntryType, type FilterFunction, } from './entry.ts';
import { type Range } from "./"
import { getEntry } from './project.ts';
import { flatten, newDragState, type DragState, type DragType } from './drag.ts';

export interface Document {
	id: DocumentId;
	name: string;
	type: DocumentType;
	thumbnail: string | null;
	entries: Entry[];

	// State
	focus: Range<EntryId> | null,
	pinned: boolean,
	filterFunction: FilterFunction,
	drag: DragState
	tipAnchor: EntryId | null
}

export type DocumentId = string;

export const newDocument = (type: DocumentType, name: string, thumbnail?: string): Document => {
	const document: Document = {
		id: crypto.randomUUID(),
		name,
		type,
		thumbnail: thumbnail ?? null,
		entries: [],
		focus: null,
		pinned: false,
		filterFunction: entryFilterFunction[entryFilter.ALL],
		drag: newDragState(),
		tipAnchor: null,
	};

	return document;
};

export const isEntrySelected = (givenId: string, document: Document): boolean => {
	if (document.focus === null) return false;

	const { anchor: anchorId, focus: focusId } = document.focus;

	const anchorIndex = document.entries.findIndex(({ id }) => id === anchorId);
	const focusIndex = document.entries.findIndex(({ id }) => id === focusId);

	const givenIndex = document.entries.findIndex(({ id }) => id === givenId);

	return (givenIndex <= focusIndex && givenIndex >= anchorIndex) ||
		(givenIndex <= anchorIndex && givenIndex >= focusIndex);
}

export const updateFocus = (document: Document, id: EntryId, type: EntrySelectionType): Document => {
	if (document.focus?.anchor === id && document.focus.focus === id) document.focus = null;
	else document.focus = { anchor: getEntry(document, id).id, focus: getEntry(document, id).id }
	return document
}

export const getFocusedEntries = (document: Document): Entry[] => {
	if (document.focus === null) return [];

	const { anchor, focus } = document.focus

	const anchorIndex = document.entries.findIndex(({ id }) => id === anchor);
	const focusIndex = document.entries.findIndex(({ id }) => id === focus);

	if (anchorIndex === focusIndex) return [document.entries[anchorIndex]];

	return document.entries.slice(anchorIndex, focusIndex);
}

export const applyFilter = (document: Document) => {
	const filterFunction = document.filterFunction;

	// This only goes one layer down, but for the prototype, this is fine.
	const topLevelEntries = document.entries.filter((value) => {
		return filterFunction(value);
	});

	if (topLevelEntries.length >= 1) return topLevelEntries;

	const entriesChildren = document.entries.reduce<Entry[]>((allChildren, current) => {
		const filteredChildren = current.children?.filter((value) => filterFunction(value)) || [];
		if (current.children) allChildren.push(...filteredChildren);
		return allChildren;
	}, []);

	if (entriesChildren.length >= 1) return entriesChildren;

	return [];
};


export const isSpaceAfterEntryInFiltered = (document: Document, id: EntryId): boolean => {
	const filteredEntries = applyFilter(document);

	const flattenedEntries = flatten(document.entries)
	const flattenedFilteredEntries = flatten(filteredEntries)

	const entry = getEntry(document, id);

	const childrenOffset = entry.children !== null ? entry.children.length : 0;

	const nextEntryIndex = flattenedEntries.findIndex((entry) => entry.id === id) + 1 + childrenOffset;
	const nextFilteredEntryIndex = flattenedFilteredEntries.findIndex((entry) => entry.id === id) + 1 + childrenOffset;

	const atEntriesEnd = nextFilteredEntryIndex >= flattenedFilteredEntries.length
	if (atEntriesEnd) return false;

	const nextEntry = flattenedEntries.at(nextEntryIndex);
	const nextEntryInFiltered = flattenedFilteredEntries.at(nextFilteredEntryIndex)

	if (nextEntry === undefined || nextEntryInFiltered === undefined) throw new Error("Could not find next entry.");

	const entryOrNextEntryIsNotParent = (nextEntryInFiltered.children === null) !== (entry.children === null)
	if (entryOrNextEntryIsNotParent) return false

	return nextEntry.id !== nextEntryInFiltered.id;
}

// Enums

export const documentType = {
	PART: 'part',
	ASSEMBLY: 'assembly',
	BIM: 'bim',
	CAM: 'cam',
	TECH_DRAW: 'tech-draw',
	VAR_SET: 'var-set'
} as const;
export type DocumentType = (typeof documentType)[keyof typeof documentType];

export const entrySelectionType = {
	SELECT: "select",
	DESELECT: "deselect",
} as const;
export type EntrySelectionType = (typeof entrySelectionType)[keyof typeof entrySelectionType];

export const documentTypeDisplayName = {
	[documentType.PART]: "Part",
	[documentType.ASSEMBLY]: "Assembly",
	[documentType.BIM]: "BIM",
	[documentType.CAM]: "CAM",
	[documentType.TECH_DRAW]: "TechDraw",
	[documentType.VAR_SET]: "VarSet",
} as const satisfies Record<DocumentType, string>;

export const documentTypeWorkbenches: Record<DocumentType, string[]> = {
	[documentType.PART]: ['Part Design', 'Sketcher', 'Surface'],
	[documentType.ASSEMBLY]: ['Assembly', 'FEM'],
	[documentType.BIM]: ['BIM'],
	[documentType.CAM]: ['CAM'],
	[documentType.TECH_DRAW]: ['TechDraw'],
	[documentType.VAR_SET]: []
} as const;

export const documentTypeIcon = {
	[documentType.PART]: "part-design",
	[documentType.ASSEMBLY]: "assembly",
	[documentType.BIM]: "bim",
	[documentType.CAM]: "cam",
	[documentType.TECH_DRAW]: "tech-draw",
	[documentType.VAR_SET]: "var-set",

} as const satisfies Record<DocumentType, string>

export const documentTypeEntryFilter: Record<DocumentType, EntryFilter[]> = {
	[documentType.PART]: [entryFilter.ALL, entryFilter.SKETCH, entryFilter.MODELLING, entryFilter.PATTERN, entryFilter.DRESS_UP, entryFilter.ISSUE],
	[documentType.ASSEMBLY]: [entryFilter.ALL, entryFilter.BODY, entryFilter.JOINT_BASIC, entryFilter.JOINT_FACE, entryFilter.JOINT_ADVANCED, entryFilter.ISSUE],
	[documentType.BIM]: [],
	[documentType.CAM]: [],
	[documentType.TECH_DRAW]: [],
	[documentType.VAR_SET]: [],
} as const;

export const documentTypeEntryCategory: Record<DocumentType, EntryCategory[]> = {
	[documentType.PART]: [entryCategory.SKETCH, entryCategory.MODELLING, entryCategory.PATTERN, entryCategory.DRESS_UP],
	[documentType.ASSEMBLY]: [entryCategory.BODY, entryCategory.JOINT_BASIC, entryCategory.JOINT_FACE, entryCategory.JOINT_ADVANCED],
	[documentType.BIM]: [],
	[documentType.CAM]: [],
	[documentType.TECH_DRAW]: [],
	[documentType.VAR_SET]: [],
}

export const documentTools = (selectedDocument: DocumentType): EntryType[] => {
	const availableCategories = documentTypeEntryCategory[selectedDocument];

	const availableEntryTypeCategories = Object.entries(entryTypeCategory).filter(([_, category]) => availableCategories.includes(category))

	const availableEntryTypes = availableEntryTypeCategories.map(([entry, _category]) => entry as EntryType)

	return availableEntryTypes
}

