import { type Entry, } from './entry.ts';

export const documentType = {
	PART: 'part',
	ASSEMBLY: 'assembly',
	BIM: 'bim',
	CAM: 'cam',
	TECH_DRAW: 'tech-draw',
	VAR_SET: 'var-set'
} as const;

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

export type DocumentType = (typeof documentType)[keyof typeof documentType];

type FilterPredicate<T> = (value: T, index: number, array: T[]) => unknown;

type EntriesFunction = (filterType?: unknown) => Entry[];

export interface Document {
	id: string;
	name: string;
	type: DocumentType;
	thumbnail: string | null;
	entries: Entry[];
}

export const newDocument = (type: DocumentType, name: string, thumbnail?: string): Document => {
	const document: Document = {
		id: crypto.randomUUID(),
		name,
		type,
		thumbnail: thumbnail ?? null,
		entries: []
	};

	return document;
};

export const documentIcon = async (type: DocumentType): Promise<string> => {
	switch (type) {
		case documentType.PART:
			return (await import("$lib/assets/tools/workbench/partdesign.svg")).default;
		case documentType.ASSEMBLY:
			return (await import("$lib/assets/tools/workbench/assembly.svg")).default
		case documentType.BIM:
			return (await import("$lib/assets/tools/workbench/bim.svg")).default
		case documentType.CAM:
			return (await import("$lib/assets/tools/workbench/cam.svg")).default
		case documentType.TECH_DRAW:
			return (await import("$lib/assets/tools/workbench/tech-draw.svg")).default
		case documentType.VAR_SET:
			return (await import("$lib/assets/tools/workbench/var-set.svg")).default
		default:
			const unhandledType: never = type;
			throw new Error(`Unhandled type case: ${unhandledType}`);
	}
};
