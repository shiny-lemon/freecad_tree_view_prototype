<script lang="ts">
	import { ChevronDown, ChevronRight, CircleAlert } from '@lucide/svelte';
	import TreeEntry from './TreeEntry.svelte';
	import IconToggle from '$lib/IconToggle.svelte';
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	import {
		entryCategory,
		entryIssueIcon,
		entryIssueMessage,
		entryIssueType,
		entryTypeCategory,
		entryTypeIcon,
		type Entry
	} from '../project/entry';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import {
		getSelected,
		setEntryCoordinates,
		setShowChildren,
		updateDocumentFocus
	} from '$lib/data/data.svelte';
	import { dragClasses, dragEventHandlers, dragType } from '$lib/project/drag';
	import { isSpaceAfterEntryInFiltered } from '$lib/project/document';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		entry: Entry;
		selected: boolean;
	}

	let { entry, selected }: Props = $props();

	const onselectactionmouse: MouseEventHandler<HTMLElement> = (event) => {
		if (nameEditable) return;

		updateDocumentFocus(entry.id);

		// const updateFocusModifierHeld = event.ctrlKey;
		// if (updateFocusModifierHeld) console.log('Updating selection!');

		// else project.selected.focus = null;
	};

	const onselectactionkeyboard: KeyboardEventHandler<HTMLElement> = (event) => {
		const updateFocusKeyPressed = event.key === 'Enter';

		if (updateFocusKeyPressed) updateDocumentFocus(entry.id);
	};

	const coordinatesRecorder: Attachment = (element) => {
		const rectangle = element.getBoundingClientRect();
		const { top, bottom } = rectangle;
		setEntryCoordinates(entry.id, { top, bottom });
	};

	const issuesAnchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();

	const entryAnchorName = $derived(newAnchorName(entry.id));

	let nameEditable = $state(false);
</script>

{#key entry.id}
	<li
		class={{
			node: true,
			selected,
			'space-after': isSpaceAfterEntryInFiltered(getSelected(), entry.id),
			...dragClasses(entry.id)
		}}
		draggable={!nameEditable}
		role="treeitem"
		tabindex="0"
		aria-selected={selected ? 'true' : 'false'}
		aria-expanded={entry.showChildren}
		style:--anchor-name={entryAnchorName}
		{...dragEventHandlers(dragType.ENTRY, entry.id)}
		{@attach coordinatesRecorder}
		// Other event handlers
		onclick={onselectactionmouse}
		onkeypress={onselectactionkeyboard}
	>
		<span class="contents">
			<div class="controls">
				{#if entry.children !== null}
					<IconToggle
						Unchecked={ChevronRight}
						Checked={ChevronDown}
						bind:checked={() => entry.showChildren, (value) => setShowChildren(entry.id, value)}
					/>
				{/if}
			</div>
			<img class="tool-icon" src={entryTypeIcon[entry.type] + '.svg'} alt="" />

			<span
				class="name-input"
				tabindex="0"
				role="textbox"
				contenteditable={nameEditable}
				ondblclick={() => (nameEditable = true)}
				onblur={() => (nameEditable = false)}>{entry.name}</span
			>

			<!-- Add dynamic issues -->
			<div class="issues">
				{#if Math.random() > 0.9}
					{@const issueType =
						entryTypeCategory[entry.type] === entryCategory.SKETCH
							? entryIssueType.NOT_FULLY_CONSTRAINED
							: entryIssueType.RECOMPUTE}
					<button
						class="icon issue"
						style:--anchor-name={issuesAnchorName}
						{...fleetingAnchorEvents}
					>
						<!-- <CircleAlert color="var(--alert-0)" /> -->
						<img class="issue-icon" src={entryIssueIcon[issueType] + '.png'} alt="" />

						<div id="issue-popover" popover="hint" {@attach fleetingTarget}>
							{entryIssueMessage[issueType]}
						</div>
					</button>
				{/if}
			</div>
		</span>

		{#if entry.children !== null && entry.showChildren}
			<ul class="children" role="group">
				{#each entry.children as child (child.id)}
					<TreeEntry entry={child} {selected} />
				{/each}
			</ul>
		{/if}
	</li>
{/key}

<style>
	.node {
		display: flex;
		flex-direction: column;
		align-content: center;

		padding: 0.25rem;
		anchor-name: var(--anchor-name);
	}
	.node.hovered {
		anchor-name: --hovered-entry;
	}
	.node.dragged {
		background-color: var(--light-contrast);
	}
	.node.dropped {
		background-color: var(--light-contrast);
		animation: background-flash 1s linear normal forwards;
	}
	.node.selected {
		color: var(--surface-0);
		background-color: var(--contrast);
		animation: none;
	}
	.node.space-after {
		padding-bottom: 0.35rem;
		margin-bottom: 0.35rem;
		border-bottom: 2px dashed var(--subtext-1);
	}

	@keyframes background-flash {
		100% {
			background-color: transparent;
		}
	}

	.contents {
		display: flex;
		align-content: center;
	}

	.controls {
		height: 24px;
		width: 24px;
		flex-shrink: 0;
	}

	.tool-icon {
		height: 1.75rem;
	}

	.name-input {
		width: 100%;
		cursor: default;
		user-select: none;
	}
	.name-input[contenteditable='true'] {
		outline: 2px solid var(--contrast);
		cursor: text;
		user-select: default;
	}

	.issue {
		anchor-name: var(--anchor-name);
		padding: 0 4px;
	}

	.issue-icon {
		width: 24px;
	}

	#issue-popover {
		position-anchor: var(--anchor-name);
		position: absolute;
		position-area: right;

		margin-left: 0.5rem;

		font-size: 0.9rem;
		font-family: inherit;

		background-color: var(--surface-0);
		border: none;
		border-radius: 4px;
	}
</style>
