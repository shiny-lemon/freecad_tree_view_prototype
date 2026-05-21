import type { DragEventHandler } from "svelte/elements";

export interface DragState<Id extends string> {
    lastHovered: Id | null,
    lastDragged: Id | null,
    lastDropped: Id | null,
    lastPosition: DragPosition | null
}

export const newDragState = (): DragState<string> => {
    return { lastHovered: null, lastDragged: null, lastDropped: null, lastPosition: null }
}

export const dragPosition = {
    TOP: "top",
    CENTER: "center",
    BOTTOM: "bottom",
} as const;
export type DragPosition = typeof dragPosition[keyof typeof dragPosition]


export const createDragStartHandler = <Id extends string>(id: Id, setDragStart: (id: Id) => unknown, collapseChildrenFunction = () => { return }): DragEventHandler<HTMLElement> => {
    return (event) => {
        if (!event.dataTransfer) throw new Error('No data from drag');

        // Makes sure parent is not also trying to drag.
        event.stopPropagation();

        event.dataTransfer.effectAllowed = 'move';

        collapseChildrenFunction();

        setDragStart(id);

        event.dataTransfer.setData('text/plain', id);
    }
};

export const createDragOverHandler = <Id extends string>(id: Id, setDragOver: (id: Id, position: DragPosition) => unknown): DragEventHandler<HTMLElement> => {
    return (event) => {
        event.preventDefault();

        const { top, bottom } = event.currentTarget.getBoundingClientRect();

        const relativePosition = (event.y - top) / (bottom - top)

        // Tenths makes the center a little smaller so edges are easier to hit than, for example, thirds.
        if (relativePosition < 4 / 10) setDragOver(id, dragPosition.TOP);
        else if (relativePosition < 5 / 10) setDragOver(id, dragPosition.CENTER);
        else if (relativePosition < 10 / 10) setDragOver(id, dragPosition.BOTTOM);
    }
}

export const createDropHandler = <Id extends string>(id: Id, setDrop: (dragged: Id, hovered: Id) => unknown): DragEventHandler<HTMLElement> => {
    return (event) => {
        event.preventDefault();

        const dragDataStore = event.dataTransfer?.getData('text/plain');

        if (dragDataStore === undefined) throw new Error('No data from drag data store.');

        const dragged = dragDataStore as Id;
        const hovered = id;

        setDrop(dragged, hovered);
    };
}