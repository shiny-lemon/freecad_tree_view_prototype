import { getDragState, setDragOver, setDragStart, setDrop, setShowChildren } from "$lib/data/data.svelte";
import type { DragEventHandler } from "svelte/elements";

export const dragKey = {
    LAST_HOVERED: "last-hovered",
    LAST_DRAGGED: "last-dragged",
    // LAST_DROPPED: "last-dropped",
} as const;
export type DragKey = typeof dragKey[keyof typeof dragKey]

export interface DragState {
    lastHovered: { type: DragType, id: string, position: DragPosition } | null
    lastDragged: { type: DragType, id: string, dropped: boolean } | null
    // [dragKey.LAST_DROPPED]: { type: DragType, id: string } | null
}

export const newDragState = (): DragState => {
    return { lastHovered: null, lastDragged: null }
}

export const dragType = {
    ENTRY: "entry",
    TIP: "tip",
    PART: "part",
} as const;
export type DragType = (typeof dragType)[keyof typeof dragType];

export const dragPosition = {
    TOP: "top",
    CENTER: "center",
    BOTTOM: "bottom",
} as const;
export type DragPosition = typeof dragPosition[keyof typeof dragPosition]

export type SetDragStart<Id extends string> = (type: DragType, id: Id) => unknown;
export type SetDragOver<Id extends string> = (type: DragType, id: Id, position: DragPosition) => unknown;
export type SetDrop<Id extends string> = (type: DragType, dragged: Id, hovered: Id) => unknown;

const createDragStartHandler = <Id extends string>(type: DragType, id: Id, setDragStart: SetDragStart<Id>, collapseChildrenFunction = () => { return }): DragEventHandler<HTMLElement> => {
    return (event) => {
        if (!event.dataTransfer) throw new Error('No data from drag');

        // Makes sure parent is not also trying to drag.
        if (event.currentTarget.draggable) {
            event.stopPropagation();
        }

        event.dataTransfer.effectAllowed = 'move';

        collapseChildrenFunction();

        setDragStart(type, id);

        event.dataTransfer.setData('text/plain', id);
    }
};

const createDragOverHandler = <Id extends string>(type: DragType, id: Id, setDragOver: SetDragOver<Id>): DragEventHandler<HTMLElement> => {
    return (event) => {
        event.preventDefault();

        const { top, bottom } = event.currentTarget.getBoundingClientRect();

        const relativePosition = (event.y - top) / (bottom - top)

        // Tenths makes the center a little smaller so edges are easier to hit than, for example, thirds.
        if (relativePosition < 4 / 10) setDragOver(type, id, dragPosition.TOP);
        else if (relativePosition < 5 / 10) setDragOver(type, id, dragPosition.CENTER);
        else if (relativePosition < 10 / 10) setDragOver(type, id, dragPosition.BOTTOM);
    }
}

const createDropHandler = <Id extends string>(type: DragType, id: Id, setDrop: SetDrop<Id>): DragEventHandler<HTMLElement> => {
    return (event) => {
        event.preventDefault();

        const dragDataStore = event.dataTransfer?.getData('text/plain');

        if (dragDataStore === undefined) throw new Error('No data from drag data store.');

        const dragged = dragDataStore as Id;
        const hovered = id;

        setDrop(type, dragged, hovered);
    };
}

export const dragClasses = <Id extends string>(id: Id) => {
    const { lastHovered, lastDragged } = getDragState();
    return {
        hovered: lastHovered?.id === id,
        dragged: lastDragged?.id === id,
        dropped: lastDragged?.id === id && lastDragged?.dropped,
    }
}

export const dragEventHandlers = <Id extends string>(type: DragType, id: Id) => {
    return {
        ondragstart: createDragStartHandler(type, id, setDragStart, () => {
            if (type === dragType.ENTRY) setShowChildren(id, false)
        }
        ),
        ondragover: createDragOverHandler(type, id, setDragOver),
        ondrop: createDropHandler(type, id, setDrop),
    }
}

export const draggerIndicatorActive = (type: DragType) => getDragState().lastHovered !== null && getDragState().lastHovered?.type === type;
export const dataDragPosition = () => getDragState().lastHovered?.position

