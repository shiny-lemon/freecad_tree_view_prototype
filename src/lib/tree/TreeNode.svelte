<script lang="ts">
	import { ChevronDown, ChevronRight, CircleAlert } from '@lucide/svelte';
	import TreeNode from './TreeNode.svelte';
	import IconToggle from '$lib/IconToggle.svelte';
	import type { DragEventHandler } from 'svelte/elements';
	import { entryTypeIcon, type Entry } from '../project/entry.ts';
	import { addLookup, findEntry } from './position.svelte.ts';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';

	interface Props {
		entry: Entry;
		index: number;
		contentRect?: DOMRectReadOnly | null;
	}

	let { entry, index, contentRect = $bindable(null) }: Props = $props();

	const ondragstart: DragEventHandler<HTMLElement> = (event) => {
		console.log(event);
		if (!event.dataTransfer) throw new Error('No data from drag');
		event.dataTransfer.effectAllowed = 'move';

		const draggenEntry = findEntry(event.target as Element);

		if (draggenEntry === undefined) throw Error('No entry found in drag start.');

		showChildren = false;

		event.dataTransfer.setData('text/plain', index.toString());
	};

	const anchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();

	let showChildren = $state(false);
	let nameEditable = $state(false);
</script>

<li
	class={{ node: true }}
	draggable="true"
	role="treeitem"
	tabindex="0"
	aria-selected="false"
	aria-expanded={showChildren}
	bind:contentRect
	{ondragstart}
	{@attach (element) => addLookup(element, entry)}
>
	<span>
		{#if entry.children !== null}
			<IconToggle Unchecked={ChevronRight} Checked={ChevronDown} bind:checked={showChildren} />
		{/if}
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
			<div class="issue" style:--anchor-name={anchorName} {...fleetingAnchorEvents}>
				<CircleAlert color="var(--alert-0)" />

				<div id="issue-popover" popover="hint" {@attach fleetingTarget}>
					<span>Sketch not fully constrained</span>
				</div>
			</div>
		</div>
	</span>

	{#if entry.children !== null && showChildren}
		<ul class="children" role="group">
			{#each entry.children as child}
				<TreeNode entry={child} {index} />
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
	}
	.node.selected {
		color: var(--surface-0);
		background-color: var(--contrast);
	}

	.node > span {
		display: flex;
		align-content: center;
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
