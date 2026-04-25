<script lang="ts">
	import { ChevronDown, ChevronRight, CircleAlert } from '@lucide/svelte';
	import TreeEntry from './TreeEntry.svelte';
	import IconToggle from '$lib/IconToggle.svelte';
	import type { DragEventHandler, EventHandler } from 'svelte/elements';
	import {
		entryCategory,
		entryTypeCategory,
		entryTypeIcon,
		move,
		positionRelation,
		type Entry
	} from '../project/entry.ts';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import type { Transaction } from '$lib/project/transaction';
	import { addTransaction, project } from '$lib/data/data.svelte';

	interface Props {
		entry: Entry;
		draggingOver: boolean;
		onnodedragenter: DragEventHandler<HTMLElement>;
		onselectaction?: EventHandler;
		selected: boolean;
	}

	let {
		entry = $bindable(),
		onnodedragenter,
		draggingOver,
		onselectaction,
		selected
	}: Props = $props();

	const ondragstart: DragEventHandler<HTMLElement> = (event) => {
		if (!event.dataTransfer) throw new Error('No data from drag');
		event.dataTransfer.effectAllowed = 'move';

		entry.showChildren = false;

		event.dataTransfer.setData('text/plain', entry.id);
	};

	const ondragover: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();
	};

	const ondrop: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();

		const dragEntryId = event.dataTransfer?.getData('text/plain');

		if (dragEntryId === undefined) throw new Error('No data from drag entry.');

		const dropEntryId = entry.id;
		// TODO loads of assumptions here: only top-level, always after, no drop inside logic, etc
		const dragDropTransaction: Transaction = (entries) => {
			return move(entries, [dragEntryId], {
				pathIds: [dropEntryId],
				relation: positionRelation.AFTER,
				in: false
			});
		};

		const documentId = project.selected?.id;
		if (documentId === undefined)
			throw new Error('No document selected for drag and drop interaction.');

		addTransaction(documentId, dragDropTransaction);
	};

	const issuesAnchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();

	const entryAnchorName = $derived(newAnchorName(entry.id));

	let nameEditable = $state(false);
</script>

<li
	class={{ node: true, 'dragging-over': draggingOver, selected }}
	draggable="true"
	role="treeitem"
	tabindex="0"
	aria-selected="false"
	aria-expanded={entry.showChildren}
	{ondragstart}
	{ondragover}
	{ondrop}
	ondragenter={onnodedragenter}
	onclick={onselectaction}
	onkeypress={onselectaction}
	style:--anchor-name={entryAnchorName}
>
	<span>
		<div class="controls">
			{#if entry.children !== null}
				<IconToggle
					Unchecked={ChevronRight}
					Checked={ChevronDown}
					bind:checked={entry.showChildren}
				/>
			{/if}
		</div>
		<img class="tool-icon" src={entryTypeIcon[entry.type] + '.svg'} alt="" />

		<!-- TODO Input messes dragging up. Should only be activated with double-click. Hard to do. -->
		<span
			class="name-input"
			tabindex="0"
			role="textbox"
			contenteditable={nameEditable}
			oninput={() => console.log('Input!')}
			ondblclick={() => (nameEditable = !nameEditable)}>{entry.name}</span
		>
		<!-- <input type="text" value={entry.name} class="disguised-input" /> -->

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
			{#each entry.children as child, index (child)}
				<!-- TODO onnodedragenter is only for the parent, need the generator function here too -->
				<TreeEntry
					bind:entry={entry.children[index]}
					{onnodedragenter}
					draggingOver={false}
					{selected}
				/>
			{/each}
		</ul>
	{/if}
</li>

<style>
	.node {
		display: flex;
		flex-direction: column;
		align-content: center;

		padding: 0.25rem;
		anchor-name: var(--anchor-name);
	}
	.node.selected {
		color: var(--surface-0);
		background-color: var(--contrast);
	}
	.node.dragging-over {
		background-color: red;
		anchor-name: --my-anchor;
	}

	.node > span {
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
