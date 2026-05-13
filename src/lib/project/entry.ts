export interface Entry {
	id: EntryId;
	type: EntryType;
	name: string;
	children: Entry[] | null;

	// State
	showChildren: boolean;
	issues: Issue[];
}

export type EntryId = string;

const issueLevel = {
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
}
type IssueLevel = typeof issueLevel[keyof typeof issueLevel]

interface Issue {
	level: IssueLevel,
	message: string,
}

export const createEntry = (type: EntryType, name: string, allowChildren = false): Entry => {
	return {
		id: crypto.randomUUID(),
		type,
		name,
		children: allowChildren ? [] : null,

		showChildren: false,
		issues: [],
	}
}

export const filter = (entries: Entry[], predicate: (entry: Entry) => boolean): Entry[] => {
	return entries.filter(predicate);
}

export const positionRelation = {
	BEFORE: "before",
	AFTER: "after",
} as const;
export type PositionRelation = typeof positionRelation[keyof typeof positionRelation]

export interface Position {
	id: EntryId | null;
	relation: PositionRelation;
	in: boolean;
}

export const insert = (entries: Entry[],
	entry: Entry,
	at: Position = { id: null, relation: positionRelation.AFTER, in: false }
): Entry[] => {

	if (at.in && at.id === null) throw new Error("Cannot insert into entry when no id is specified.")

	if (entries.length === 0) return [entry]

	return traverse(entries, (previous, current) => {
		const insertNextTo = !at.in && current.id === at.id
		if (at.relation === positionRelation.BEFORE && insertNextTo) return [...previous, entry, current];
		if (at.relation === positionRelation.AFTER && insertNextTo || at.id === null) return [...previous, current, entry];

		if (at.in && current.id === at.id) {
			const inPosition = { in: false, id: null, relation: at.relation }
			current.children = insert(current.children || [], entry, inPosition);
		}

		return [...previous, current]
	})
}

const find = (entries: Entry[], id: EntryId): Entry => {
	const result = flatten(entries).find((entry) => entry.id === id)
	if (result === undefined) throw new Error(`Could not find entry with id ${id}`);
	return result;
}

const remove = (entries: Entry[], id: EntryId): Entry[] => {
	return traverse(entries, (previous, current) => {
		if (current.id === id) return previous

		if (current.children !== null) {
			current.children = remove(current.children, id)
		}

		return [...previous, current]
	})
}

export const move = (entries: Entry[], id: EntryId, to: Position) => {
	const entry = find(entries, id)
	const remainingEntries = remove(entries, id);

	return insert(remainingEntries, entry, to);
}

export const traverse = (entries: Entry[], callbackfn: (previousValue: Entry[], currentValue: Entry, currentIndex: number, array: Entry[]) => Entry[]): Entry[] => {
	return entries.reduce<Entry[]>((previousValue, currentValue, currentIndex, array) => {
		return callbackfn(previousValue, currentValue, currentIndex, array)
	}, [])
}

export const flatten = (entries: Entry[]): Entry[] => {
	return traverse(entries, (previous, current) => {
		const currentEntries = flatten(current.children || []);
		return [...previous, current, ...currentEntries];
	})
}

// Enums
export const entryType = {
	SKETCH: "sketch",

	PAD: 'pad',
	POCKET: 'pocket',

	LINEAR: 'linear',
	POLAR: 'polar',

	FILLET: 'fillet',
	CHAMFER: 'chamfer',

	FIXED: 'fixed',
	REVOLUTE: 'revolute',
	CYLINDRICAL: 'cylindrical',
	SLIDER: 'slider',
	BALL: 'ball',

	DISTANCE: 'distance',
	PARALLEL: 'parallel',
	PERPENDICULAR: 'perpendicular',
	ANGLE: 'angle',

	RACK_AND_PINION: 'rack-and-pinion',
	SCREW: 'screw',
	GEARS: 'gears',
	BELT: 'belt',

	BODY: "body",

	FOLDER: "folder",
} as const;
export type EntryType = typeof entryType[keyof typeof entryType]

const toolPath = "src/lib/assets/tools/" as const;
export const entryTypeIcon = {
	[entryType.SKETCH]: toolPath + "part-design/new-sketch",

	[entryType.PAD]: toolPath + "part-design/pad",
	[entryType.POCKET]: toolPath + "part-design/pocket",

	[entryType.LINEAR]: toolPath + "part-design/linear-pattern",
	[entryType.POLAR]: toolPath + "part-design/polar-pattern",

	[entryType.FILLET]: toolPath + "part-design/fillet",
	[entryType.CHAMFER]: toolPath + "part-design/chamfer",

	[entryType.FIXED]: toolPath + "assembly/fixed-joint",
	[entryType.REVOLUTE]: toolPath + "assembly/revolute-joint",
	[entryType.CYLINDRICAL]: toolPath + "assembly/cylindrical-joint",
	[entryType.SLIDER]: toolPath + "assembly/slider-joint",
	[entryType.BALL]: toolPath + "assembly/ball-joint",

	[entryType.DISTANCE]: toolPath + "assembly/distance-joint",
	[entryType.PARALLEL]: toolPath + "assembly/parallel-joint",
	[entryType.PERPENDICULAR]: toolPath + "assembly/perpendicular-joint",
	[entryType.ANGLE]: toolPath + "assembly/angle-joint",

	[entryType.RACK_AND_PINION]: toolPath + "assembly/rack-pinion-joint",
	[entryType.SCREW]: toolPath + "assembly/screw-joint",
	[entryType.GEARS]: toolPath + "assembly/gears-joint",
	[entryType.BELT]: toolPath + "assembly/belt-joint",

	[entryType.BODY]: toolPath + "part-design/body",

	[entryType.FOLDER]: toolPath + "std/group",

} as const satisfies Record<EntryType, string>

export const entryCategory = {
	SKETCH: "sketch",
	MODELLING: "modelling",
	PATTERN: "pattern",
	DRESS_UP: "dress-up",
	JOINT_BASIC: "joint-basic",
	JOINT_FACE: "joint-face",
	JOINT_ADVANCED: "joint-advanced",
	BODY: "body",
	NO_CATEGORY: "no-category",
} as const;
export type EntryCategory = typeof entryCategory[keyof typeof entryCategory]

export const entryTypeCategory: Record<EntryType, EntryCategory> = {
	[entryType.SKETCH]: entryCategory.SKETCH,

	[entryType.PAD]: entryCategory.MODELLING,
	[entryType.POCKET]: entryCategory.MODELLING,

	[entryType.LINEAR]: entryCategory.PATTERN,
	[entryType.POLAR]: entryCategory.PATTERN,

	[entryType.FILLET]: entryCategory.DRESS_UP,
	[entryType.CHAMFER]: entryCategory.DRESS_UP,

	[entryType.FIXED]: entryCategory.JOINT_BASIC,
	[entryType.REVOLUTE]: entryCategory.JOINT_BASIC,
	[entryType.CYLINDRICAL]: entryCategory.JOINT_BASIC,
	[entryType.SLIDER]: entryCategory.JOINT_BASIC,
	[entryType.BALL]: entryCategory.JOINT_BASIC,

	[entryType.DISTANCE]: entryCategory.JOINT_FACE,
	[entryType.PARALLEL]: entryCategory.JOINT_FACE,
	[entryType.PERPENDICULAR]: entryCategory.JOINT_FACE,
	[entryType.ANGLE]: entryCategory.JOINT_FACE,

	[entryType.RACK_AND_PINION]: entryCategory.JOINT_ADVANCED,
	[entryType.SCREW]: entryCategory.JOINT_ADVANCED,
	[entryType.GEARS]: entryCategory.JOINT_ADVANCED,
	[entryType.BELT]: entryCategory.JOINT_ADVANCED,

	[entryType.BODY]: entryCategory.BODY,

	[entryType.FOLDER]: entryCategory.NO_CATEGORY,
} as const;

export const entryCategoryDisplayName = {
	[entryCategory.SKETCH]: "Sketches",
	[entryCategory.MODELLING]: "Modelling",
	[entryCategory.PATTERN]: "Patterns",
	[entryCategory.DRESS_UP]: "Dress-ups",
	[entryCategory.JOINT_BASIC]: "Basic joints",
	[entryCategory.JOINT_FACE]: "Face joints",
	[entryCategory.JOINT_ADVANCED]: "Advanced joints",
	[entryCategory.BODY]: "Bodies",
	[entryCategory.NO_CATEGORY]: null,
} as const satisfies Record<EntryCategory, string | null>

export const entryFilter = {
	"ALL": "all",
	"SKETCH": "sketch",
	"MODELLING": "modelling",
	"PATTERN": "pattern",
	"DRESS_UP": "dress_up",
	"ISSUE": "issue",
} as const
export type EntryFilter = typeof entryFilter[keyof typeof entryFilter]

export type FilterFunction = (entry: Entry) => boolean

export const entryFilterFunction: Record<EntryFilter, FilterFunction> = {
	[entryFilter.ALL]: (_entry) => true,
	[entryFilter.SKETCH]: ({ type }) => entryTypeCategory[type] === entryCategory.SKETCH,
	[entryFilter.MODELLING]: ({ type }) => entryTypeCategory[type] === entryCategory.MODELLING,
	[entryFilter.PATTERN]: ({ type }) => entryTypeCategory[type] === entryCategory.PATTERN,
	[entryFilter.DRESS_UP]: ({ type }) => entryTypeCategory[type] === entryCategory.DRESS_UP,
	[entryFilter.ISSUE]: ({ issues }) => issues.length > 0,
} as const

export const entryFilterDisplayName = {
	[entryFilter.ALL]: "All",
	[entryFilter.SKETCH]: entryCategoryDisplayName[entryCategory.SKETCH],
	[entryFilter.MODELLING]: entryCategoryDisplayName[entryCategory.MODELLING],
	[entryFilter.PATTERN]: entryCategoryDisplayName[entryCategory.PATTERN],
	[entryFilter.DRESS_UP]: entryCategoryDisplayName[entryCategory.DRESS_UP],
	[entryFilter.ISSUE]: "Issues",
} as const