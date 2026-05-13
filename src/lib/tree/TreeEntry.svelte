<script lang="ts">
	import { ChevronDown, ChevronRight, CircleAlert } from '@lucide/svelte';
	import TreeEntry from './TreeEntry.svelte';
	import IconToggle from '$lib/IconToggle.svelte';
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	import { entryCategory, entryTypeCategory, entryTypeIcon, type Entry } from '../project/entry.ts';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import {
		getEntryDragState,
		setDragStart,
		setDrop,
		setDragOver,
		setShowChildren,
		updateDocumentFocus
	} from '$lib/data/data.svelte';
	import {
		createDragOverHandler,
		createDragStartHandler,
		createDropHandler
	} from '$lib/project/drag';

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

	const issuesAnchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();

	const entryAnchorName = $derived(newAnchorName(entry.id));

	let nameEditable = $state(false);
</script>

{#key entry.id}
	<li
		class={{
			node: true,
			hovered: getEntryDragState().lastHovered === entry.id,
			dragged: getEntryDragState().lastDragged === entry.id,
			dropped: getEntryDragState().lastDropped === entry.id,
			selected
		}}
		draggable="true"
		role="treeitem"
		tabindex="0"
		aria-selected={selected ? 'true' : 'false'}
		aria-expanded={entry.showChildren}
		style:--anchor-name={entryAnchorName}
		// Drag event handlers
		ondragstart={createDragStartHandler(entry.id, setDragStart, () =>
			setShowChildren(entry.id, false)
		)}
		ondragover={createDragOverHandler(entry.id, setDragOver)}
		ondrop={createDropHandler(entry.id, setDrop)}
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
					<div class="issue" style:--anchor-name={issuesAnchorName} {...fleetingAnchorEvents}>
						<CircleAlert color="var(--alert-0)" />

						<div id="issue-popover" popover="hint" {@attach fleetingTarget}>
							{#if entryTypeCategory[entry.type] === entryCategory.SKETCH}
								<span>Sketch is not fully constrained</span>
							{:else if entryTypeCategory[entry.type] === entryCategory.MODELLING}
								<span>Sketch is not closed</span>
							{:else}
								<span>Reference is broken</span>
							{/if}
						</div>
					</div>
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
		anchor-name: --my-anchor;
	}
	.node.dragged {
		background-color: lightgreen;
	}
	.node.dropped {
		background-color: lightsalmon;
		animation: background-flash 1s linear normal forwards;
	}
	.node.selected {
		color: var(--surface-0);
		background-color: var(--contrast);
		animation: none;
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
		outline: 2px solid red;
		cursor: text;
		user-select: default;
	}

	.issue {
		anchor-name: var(--anchor-name);
		padding: 0 4px;
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
