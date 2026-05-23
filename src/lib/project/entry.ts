export interface Entry {
	id: EntryId;
	type: EntryType;
	name: string;
	children: Entry[] | null;

	// State
	showChildren: boolean;
	issues: EntryIssueType[];
	coordinates: EntryCoordinates | null
}

export type EntryId = string;

export const createEntry = (type: EntryType, name: string, allowChildren = false): Entry => {
	return {
		id: crypto.randomUUID(),
		type,
		name,
		children: allowChildren ? [] : null,

		showChildren: false,
		issues: [],
		coordinates: null,
	}
}

export interface EntryCoordinates {
	top: number;
	bottom: number;
}

export const filter = (entries: Entry[], predicate: (entry: Entry) => boolean): Entry[] => {
	return entries.filter(predicate);
}

// Enums
export const entryType = {
	SKETCH: "sketch",

	PAD: 'pad',
	POCKET: 'pocket',

	LINEAR: 'linear',
	POLAR: 'polar',
	MIRROR: "mirror",

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

export const entryTypeIcon = {
	[entryType.SKETCH]: "new-sketch",

	[entryType.PAD]: "pad",
	[entryType.POCKET]: "pocket",

	[entryType.LINEAR]: "linear-pattern",
	[entryType.POLAR]: "polar-pattern",
	[entryType.MIRROR]: "mirrored",

	[entryType.FILLET]: "fillet",
	[entryType.CHAMFER]: "chamfer",

	[entryType.FIXED]: "fixed-joint",
	[entryType.REVOLUTE]: "revolute-joint",
	[entryType.CYLINDRICAL]: "cylindrical-joint",
	[entryType.SLIDER]: "slider-joint",
	[entryType.BALL]: "ball-joint",

	[entryType.DISTANCE]: "distance-joint",
	[entryType.PARALLEL]: "parallel-joint",
	[entryType.PERPENDICULAR]: "perpendicular-joint",
	[entryType.ANGLE]: "angle-joint",

	[entryType.RACK_AND_PINION]: "rack-pinion-joint",
	[entryType.SCREW]: "screw-joint",
	[entryType.GEARS]: "gears-joint",
	[entryType.BELT]: "belt-joint",

	[entryType.BODY]: "body",

	[entryType.FOLDER]: "group",

} as const satisfies Record<EntryType, string>

export const entryIssueType = {
	ERROR: "error",
	NOT_FULLY_CONSTRAINED: "not-fully-constrained",
	RECOMPUTE: "recompute",
	UNATTATCHED: "unattatched"
} as const
export type EntryIssueType = typeof entryIssueType[keyof typeof entryIssueType]

export const entryIssueIcon = {
	[entryIssueType.ERROR]: "error",
	[entryIssueType.NOT_FULLY_CONSTRAINED]: "notfullyconstrained",
	[entryIssueType.RECOMPUTE]: "recompute",
	[entryIssueType.UNATTATCHED]: "unattatched"
} as const satisfies Record<EntryIssueType, string>

export const entryIssueMessage = {
	[entryIssueType.ERROR]: "Something is wrong with this feature",
	[entryIssueType.NOT_FULLY_CONSTRAINED]: "Sketch is not fully constrained",
	[entryIssueType.RECOMPUTE]: "Feature needs to be recomputed",
	[entryIssueType.UNATTATCHED]: "Sketch is unattatched"
} as const satisfies Record<EntryIssueType, string>

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
	[entryType.MIRROR]: entryCategory.PATTERN,

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
	"DRESS_UP": "dress-up",
	"JOINT_BASIC": "joint-basic",
	"JOINT_FACE": "joint-face",
	"JOINT_ADVANCED": "joint-advanced",
	"BODY": "body",
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

	[entryFilter.JOINT_BASIC]: ({ type }) => entryTypeCategory[type] === entryCategory.JOINT_BASIC,
	[entryFilter.JOINT_FACE]: ({ type }) => entryTypeCategory[type] === entryCategory.JOINT_FACE,
	[entryFilter.JOINT_ADVANCED]: ({ type }) => entryTypeCategory[type] === entryCategory.JOINT_ADVANCED,
	[entryFilter.BODY]: ({ type }) => entryTypeCategory[type] === entryCategory.BODY,

	[entryFilter.ISSUE]: ({ issues }) => issues.length > 0,
} as const

export const entryFilterDisplayName: Record<EntryFilter, string> = {
	[entryFilter.ALL]: "All",

	[entryFilter.SKETCH]: entryCategoryDisplayName[entryCategory.SKETCH],
	[entryFilter.MODELLING]: entryCategoryDisplayName[entryCategory.MODELLING],
	[entryFilter.PATTERN]: entryCategoryDisplayName[entryCategory.PATTERN],
	[entryFilter.DRESS_UP]: entryCategoryDisplayName[entryCategory.DRESS_UP],

	[entryFilter.JOINT_BASIC]: entryCategoryDisplayName[entryCategory.JOINT_BASIC],
	[entryFilter.JOINT_FACE]: entryCategoryDisplayName[entryCategory.JOINT_FACE],
	[entryFilter.JOINT_ADVANCED]: entryCategoryDisplayName[entryCategory.JOINT_ADVANCED],
	[entryFilter.BODY]: entryCategoryDisplayName[entryCategory.BODY],

	[entryFilter.ISSUE]: "Issues",
} as const