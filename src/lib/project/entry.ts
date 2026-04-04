export interface Entry {
	id: string;
	type: EntryType;
	name: string;
	children: Entry[] | null;
}

export const createEntry = (type: EntryType, name: string, allowChildren = true): Entry => {
	return {
		id: crypto.randomUUID(),
		type,
		name,
		children: allowChildren ? [] : null
	}
}

export const filter = (entries: Entry[], predicate: (entry: Entry) => boolean): Entry[] => {
	return entries.filter(predicate);
}

export const positionRelation = {
	BEFORE: "before",
	AFTER: "after",
} as const;

export interface Position {
	pathIds: string[];
	relation: typeof positionRelation[keyof typeof positionRelation];
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

const findRecursiveAndRemove = (entries: Entry[], pathIds: string[]): { entry: Entry, remaining: Entry[] } => {
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

export const move = (entries: Entry[], pathIds: string[], to: Position) => {
	const { entry, remaining } = findRecursiveAndRemove(entries, pathIds);

	return insert(remaining, entry, to);
}

export const entryType = {
	SKETCH: "sketch",

	PAD: 'pad',
	POCKET: 'pocket',

	LINEAR: 'linear',
	RADIAL: 'radial',

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
type EntryType = typeof entryType[keyof typeof entryType]

const toolsPath = "src/lib/assets/tools/" as const;
export const entryTypeIcon = {
	[entryType.SKETCH]: toolsPath + "part-design/new-sketch",

	[entryType.PAD]: toolsPath + "part-design/pad",
	[entryType.POCKET]: toolsPath + "part-design/pocket",

	[entryType.LINEAR]: toolsPath + "part-design/linear-pattern",
	[entryType.RADIAL]: toolsPath + "part-design/",

	[entryType.FILLET]: toolsPath + "part-design/fillet",
	[entryType.CHAMFER]: toolsPath + "part-design/chamfer",

	[entryType.FIXED]: toolsPath + "assembly/",
	[entryType.REVOLUTE]: toolsPath + "assembly/",
	[entryType.CYLINDRICAL]: toolsPath + "assembly/",
	[entryType.SLIDER]: toolsPath + "assembly/",
	[entryType.BALL]: toolsPath + "assembly/",

	[entryType.DISTANCE]: toolsPath + "assembly/",
	[entryType.PARALLEL]: toolsPath + "assembly/",
	[entryType.PERPENDICULAR]: toolsPath + "assembly/",
	[entryType.ANGLE]: toolsPath + "assembly/",

	[entryType.RACK_AND_PINION]: toolsPath + "assembly/",
	[entryType.SCREW]: toolsPath + "assembly/",
	[entryType.GEARS]: toolsPath + "assembly/",
	[entryType.BELT]: toolsPath + "assembly/",

	[entryType.BODY]: toolsPath + "part-design/body",

	[entryType.FOLDER]: toolsPath + "std/group",

} as const satisfies Record<EntryType, string>

const entryCategory = {
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

export const entryTypeCategory = {
	[entryType.SKETCH]: entryCategory.SKETCH,

	[entryType.PAD]: entryCategory.MODELLING,
	[entryType.POCKET]: entryCategory.MODELLING,

	[entryType.LINEAR]: entryCategory.PATTERN,
	[entryType.RADIAL]: entryCategory.PATTERN,

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
} satisfies Record<EntryType, EntryCategory>;

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