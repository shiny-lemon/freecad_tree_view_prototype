export interface Range<Id extends string> {
    anchor: Id,
    focus: Id,
}

export const positionRelation = {
    BEFORE: "before",
    AFTER: "after",
} as const;
export type PositionRelation = typeof positionRelation[keyof typeof positionRelation]

export interface Position {
    id: string | null;
    relation: PositionRelation;
    in: boolean;
}


interface Element {
    id: string,
    children?: Element[] | null
}

export const insert = <TElement extends Element>(elements: TElement[],
    element: TElement,
    at: Position = { id: null, relation: positionRelation.AFTER, in: false }
): TElement[] => {

    if (at.in && at.id === null) throw new Error("Cannot insert into entry when no id is specified.")

    if (elements.length === 0) return [element]

    return traverse(elements, (previous, current) => {
        const insertNextTo = !at.in && current.id === at.id
        if (at.relation === positionRelation.BEFORE && insertNextTo) return [...previous, element, current];
        if (at.relation === positionRelation.AFTER && insertNextTo || at.id === null) return [...previous, current, element];

        if (at.in && current.id === at.id) {
            const inPosition = { in: false, id: null, relation: at.relation }
            current.children = insert(current.children || [], element, inPosition);
        }

        return [...previous, current]
    })
}

export const find = <TElement extends Element>(elements: TElement[], id: string): TElement => {
    const result = flatten(elements).find((entry) => entry.id === id)
    if (result === undefined) throw new Error(`Could not find entry with id ${id}`);
    return result;
}

export const remove = <TElement extends Element>(elements: TElement[], id: string): TElement[] => {
    return traverse(elements, (previous, current) => {
        if (current.id === id) return previous

        if (current.children !== null && current.children !== undefined) {
            current.children = remove(current.children, id)
        }

        return [...previous, current]
    })
}

export const move = <TElement extends Element>(elements: TElement[], id: string, to: Position) => {
    const element = find(elements, id)
    const remainingElements = remove(elements, id);

    return insert(remainingElements, element, to);
}

export const traverse = <TElement extends Element>(elements: TElement[], callbackfn: (previousValue: TElement[], currentValue: TElement, currentIndex: number, array: TElement[]) => TElement[]): TElement[] => {
    return elements.reduce<TElement[]>((previousValue, currentValue, currentIndex, array) => {
        return callbackfn(previousValue, currentValue, currentIndex, array)
    }, [])
}

export const flatten = <TElement extends Element>(elements: TElement[]): TElement[] => {
    return traverse<TElement>(elements, (previous, current) => {
        if (current.children === null || current.children === undefined) {
            return [...previous, current]
        }

        const currentElements = flatten<TElement>(current.children as TElement[]);

        return [...previous, current, ...currentElements];
    })
}