import type { Attachment } from "svelte/attachments";

export const newAnchorName = (string: string = crypto.randomUUID()) => '--' + string;

export const popoverAnchorEvents = (showFunction: () => void, hideFunction: () => void) => {
    const eventListeners = {
        onfocus: showFunction,
        onblur: hideFunction,
        onfocusin: showFunction,
        onfocusout: hideFunction,
        onmouseover: showFunction,
        onmouseleave: hideFunction,
    } as const;
    return eventListeners;
};

export const popoverTarget = (checkFunction: () => boolean = () => true): Attachment<HTMLElement> => (element) => {
    if (checkFunction()) element.showPopover();
    else element.hidePopover();
};
