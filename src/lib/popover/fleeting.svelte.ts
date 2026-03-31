import { popoverAnchorEvents, popoverTarget } from ".";

export const newFleetingPopover = () => {
    let elementFocus = $state(false);

    const show = () => {
        (elementFocus = true)
    };
    const hide = () => (elementFocus = false);

    const fleetingAnchorEvents = popoverAnchorEvents(show, hide)
    const fleetingTarget = popoverTarget(() => elementFocus)

    return { fleetingAnchorEvents, fleetingTarget }
}
