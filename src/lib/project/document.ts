import { entryCategory, entryTypeCategory, type Entry, type EntryCategory, type EntryId, type EntryType, } from './entry.ts';
import { type Range } from "./"

export interface Document {
	id: DocumentId;
	name: string;
	type: DocumentType;
	thumbnail: string | null;
	entries: Entry[];

	// State
	focus: Range<EntryId> | null,
	lastHoveredWhileDragging: EntryId | null,
	pinned: boolean,
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
		lastHoveredWhileDragging: null,
		pinned: false,
	};

	return document;
};

export const documentType = {
	PART: 'part',
	ASSEMBLY: 'assembly',
	BIM: 'bim',
	CAM: 'cam',
	TECH_DRAW: 'tech-draw',
	VAR_SET: 'var-set'
} as const;
export type DocumentType = (typeof documentType)[keyof typeof documentType];

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

const workbenchPath = "src/lib/assets/tools/workbench/" as const;
export const documentTypeIcon = {
	[documentType.PART]: workbenchPath + "part-design",
	[documentType.ASSEMBLY]: workbenchPath + "assembly",
	[documentType.BIM]: workbenchPath + "bim",
	[documentType.CAM]: workbenchPath + "cam",
	[documentType.TECH_DRAW]: workbenchPath + "tech-draw",
	[documentType.VAR_SET]: workbenchPath + "var-set",

} as const satisfies Record<DocumentType, string>

export const documentTypeEntryCategory: Record<DocumentType, EntryCategory[]> = {
	[documentType.PART]: [entryCategory.SKETCH, entryCategory.MODELLING, entryCategory.PATTERN, entryCategory.DRESS_UP],
	[documentType.ASSEMBLY]: [entryCategory.BODY, entryCategory.JOINT_BASIC, entryCategory.JOINT_FACE, entryCategory.JOINT_ADVANCED],
	[documentType.BIM]: [],
	[documentType.CAM]: [],
	[documentType.TECH_DRAW]: [],
	[documentType.VAR_SET]: [],
} as const;

export const documentTools = (selectedDocument: DocumentType): EntryType[] => {
	const availableCategories = documentTypeEntryCategory[selectedDocument];

	const availableEntries = Object.entries(entryTypeCategory).filter(([_entry, category]) => availableCategories.includes(category))
	return availableEntries.map(([entry, _category]) => entry as EntryType)
}

