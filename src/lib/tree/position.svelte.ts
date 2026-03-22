import type { Entry } from '$lib/project/entry';

export interface TreeNodeRange {
	top: number;
	bottom: number;
	entry: Entry;
}

interface ElementEntryLookup {
	element: Element;
	entry: Entry;
}

const elementEntryLookup: ElementEntryLookup[] = [];

export const addLookup = (element: Element, entry: Entry) => {
	elementEntryLookup.push({ element, entry });
};

export const findEntry = (givenElement: Element) => {
	return elementEntryLookup.find(
		({ element }) => element.isEqualNode(givenElement) || element.contains(givenElement)
	)?.entry;
};

export const findElement = (givenEntry: Entry) => {
	return elementEntryLookup.find(({ entry }) => entry.id === givenEntry.id)?.element;
};

const nodeRanges: TreeNodeRange[] = [];

export const addNodeRange = (nodeRange: TreeNodeRange) => {
	return nodeRanges.push(nodeRange);
};

const isInsideNodeRange = (position: number, { top, bottom }: TreeNodeRange): boolean => {
	return position >= top && position <= bottom;
};

export const findNearestNodeInbetweenPosition = (position: number): number => {
	const closestNodes = nodeRanges.filter((value) => isInsideNodeRange(position, value));

	console.log(closestNodes);
	if (closestNodes.length !== 1) throw Error('Multiple close nodes! NOT IMPLEMENTED.');

	const closestNode = closestNodes[0];
	const distanceToTop = Math.abs(position - closestNode.top);

	const nearestPosition = distanceToTop ? closestNode.top : closestNode.bottom;

	return nearestPosition;
};
