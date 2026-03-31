// Many of the things in `feature.ts` should be generalized to entry.ts
// As joints and parts in an assembly are not features, but behave in mostly the same way
// Therefore good to split them up
// Can't call it object, because of JavaScript and its names...

import type { Feature, FeatureType } from './feature';
import type { JointType } from './joint';

export interface Entry {
	id: string;
	type: EntryType;
	name: string;
}

export const folderType = 'folder' as const;
export type FolderType = typeof folderType;
export interface Folder extends Entry {
	type: FolderType;
	children: Entry[];
}

export const partEntryType = 'part' as const;
export type PartEntryType = typeof partEntryType;
export interface PartEntry extends Entry {
	type: PartEntryType;
}

export type EntryType = FeatureType | JointType | FolderType | PartEntryType;

export const isEntryWithChildren = (entry: Entry): entry is Folder | Feature => {
	const typedEntry = entry as Folder | Feature;
	return typedEntry.children !== undefined;
};

export const folder = (name: string): Folder => {
	const folder: Folder = { id: crypto.randomUUID(), type: folderType, name, children: [] };

	return folder;
};

export const insert = (entry: Entry, into: Entry[], at: number = -1) => {
	if (at === -1) {
		into.push(entry);
	} else {
		into.splice(at, 0, entry);
	}
	return into;
};

export const seek = <TEntry extends Entry>(entries: TEntry[], at: number = -1) => {
	const found = entries.at(at);

	if (found === undefined) throw Error(`Cannot find entry at ${at} in ${entries}`);

	return found;
};

export const findIndex = <TEntry extends Entry>(entries: TEntry[], desired: TEntry) => {
	console.log('Entries: ', entries);
	const find = entries.findIndex(({ id }) => id === desired.id);

	if (find === -1) throw Error(`Cannot find desired entry ${desired} in ${entries}`);

	return find;
};

// https://svelte.dev/docs/svelte/svelte-js-files
export const move = (entries: Entry[], at: number, to: number) => {
	const entryToMove = seek(entries, at);
	entries.splice(at, 1);
	entries.splice(to, 0, entryToMove);
	return entries;
};

export const rename = (entries: Entry[], at: number, name: string) => {
	const entryToRename = seek(entries, at);
	entryToRename.name = name;
	return entries;
};

// We actually don't really care if its a joint, a feature or a folder. It's all the same to the tree view!
// So the "perfect" structure should just be gone.
// Let's only implement *exactly* what is needed for the tree. No further typing/division/structure necessary.
// All entries should be one
// Each entry should have an image
// entry can return null (can't have children) or [] (doesn't have children *right now* but is able to have them)
// Instead of having all of these isXGroup (like isSketchType) which *technically* is more functional can't we just have a 'group' attribute
// Then we can sort between all availabe groups - not computationally efficient, but time efficient for me!

interface NewEntry {
	id: string;
	type: string;
	group: string; // <---- Probably just a tuple in type instead :/
	name: string;
	children: NewEntry | null;
}

// type EntryGroup = [???, ???]
// type Workbenches = "part-design" | "Surface"

// Something in practice like this instead, maybe?
// type = ["dress-up", "fillet"]