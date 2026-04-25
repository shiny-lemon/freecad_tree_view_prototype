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

export const createEntry = (type: EntryType, name: string, allowChildren = true): Entry => {
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
	pathIds: EntryId[];
	relation: PositionRelation;
	in: boolean;
}

export const insert = (entries: Entry[],
	entry: Entry,
	at: Position = { pathIds: [], relation: positionRelation.AFTER, in: false }
): Entry[] => {
	const [pathId, ...pathIdsRemaining] = at.pathIds;

	if (at.in && at.pathIds.length === 0) throw new Error("Cannot insert into entry when no pathId is specified.")

	if (at.pathIds.length === 0) {
		const pathIndex = at.relation === positionRelation.AFTER ? entries.length : 0;

		return entries.toSpliced(pathIndex, 0, entry);
	}

	if (!at.in && at.pathIds.length === 1) {
		const pathIndex = entries.findIndex((value) => value.id === pathId);

		const afterOffset = at.relation === positionRelation.AFTER ? 1 : 0;

		return entries.toSpliced(pathIndex + afterOffset, 0, entry);
	}

	if (!entries.some((value) => value.id === pathId)) throw new Error(`Given pathId: ${pathId} is invalid`);
	return entries.map((value) => {
		if (value.id !== pathId) return value;

		if (value.children === null) throw new Error(`Cannot insert into entry with type ${value.type} which does not allow children.`);

		const nextIn = pathIdsRemaining.length === 0 ? false : at.in
		const nextAt = { pathIds: pathIdsRemaining, relation: at.relation, in: nextIn }

		value.children = insert(value.children, entry, nextAt);

		return value
	})
}

const findRecursiveAndRemove = (entries: Entry[], pathIds: EntryId[]): { entry: Entry, remaining: Entry[] } => {
	const [pathId, ...pathIdsRemaining] = pathIds;

	if (pathIds.length === 1) {
		const foundEntryIndex = entries.findIndex((value) => value.id === pathId);

		if (foundEntryIndex === -1) throw new Error(`Cannot find entry with ${pathIds} in entries.`)

		const remainingEntries = entries.toSpliced(foundEntryIndex, 1);
		const finalEntry = entries.at(foundEntryIndex) as Entry;

		return { entry: finalEntry, remaining: remainingEntries }

	};

	const nextEntryIndex = entries.findIndex((value) => value.id === pathId);

	if (nextEntryIndex === -1) throw new Error(`Given pathId: ${pathId} is invalid`);

	// Array.slice(...) apparently does not do deep-copy. This seems a bit like a hack, but it works!
	const nextEntry = structuredClone(entries.at(nextEntryIndex) as Entry);

	if (nextEntry.children === null) throw new Error(`Cannot insert into entry with type ${nextEntry.type} which does not allow children.`);

	const nextRecursive = findRecursiveAndRemove(nextEntry.children, pathIdsRemaining);

	nextEntry.children = nextRecursive.remaining // <--- TODO Remove mutation so structuredClone is not needed.

	const remaining = entries.toSpliced(nextEntryIndex, 1, nextEntry)
	return { entry: nextRecursive.entry, remaining }
}

export const move = (entries: Entry[], pathIds: EntryId[], to: Position) => {
	const { entry, remaining } = findRecursiveAndRemove(entries, pathIds);

	return insert(remaining, entry, to);
}

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
