<script lang="ts">
	import { ChevronDown, ChevronRight, Eye, EyeOff, CircleAlert } from '@lucide/svelte';
	import TreeNode from './TreeNode.svelte';
	import IconToggle from '$lib/IconToggle.svelte';
	import type { DragEventHandler } from 'svelte/elements';
	import { findIndex, isEntryWithChildren, type Entry } from '../project/entry.ts';
	import type { Attachment } from 'svelte/attachments';
	import { addLookup, findEntry } from './position.svelte.ts';
	import body from '$lib/assets/tools/part-design/body.svg';

	interface Props {
		entry: Entry;
		index: number;
		level?: number;
		contentRect?: DOMRectReadOnly | null;
	}

	let { entry, index, level = 0, contentRect = $bindable(null) }: Props = $props();

	let showChildren = $state(false);

	let thisNode: HTMLDivElement;
	// const ondragstart: DragEventHandler<HTMLElement> = (event) => {
	// 	if (event.target != thisNode) return;

	// 	showChildren = false;
	// };

	const ondragstart: DragEventHandler<HTMLElement> = (event) => {
		console.log(event);
		if (!event.dataTransfer) throw new Error('No data from drag');
		event.dataTransfer.effectAllowed = 'move';

		const draggenEntry = findEntry(event.target as Element);

		if (draggenEntry === undefined) throw Error('No entry found in drag start.');

		event.dataTransfer.setData('text/plain', index.toString());
	};
</script>

<div
	class="node"
	draggable="true"
	role="treeitem"
	tabindex="0"
	aria-selected="false"
	bind:this={thisNode}
	bind:contentRect
	{ondragstart}
	{@attach (element) => addLookup(element, entry)}
>
	<span>
		<IconToggle Unchecked={ChevronRight} Checked={ChevronDown} bind:checked={showChildren} />
		<IconToggle Unchecked={Eye} Checked={EyeOff} />
		<img class="tool-icon" src={body} alt="" />

		<!-- TODO Input messes dragging up. Should only be activated with double-click. Hard to do. -->
		<input type="text" value={entry.name} class="disguised-input" />

		<!-- Add dynamic issues -->
		<!-- And issue name on hover -->
		<CircleAlert color="var(--alert-0)" />
	</span>

	{#if isEntryWithChildren(entry) && showChildren}
		<div class="children" style="--level: {level + 1}rem;">
			{#each entry.children as child}
				<TreeNode entry={child} level={level + 1} {index} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.node {
		display: flex;
		flex-direction: column;
		align-content: center;

		padding: 0.25rem;
		padding-left: var(--level);
	}
	.node > span {
		display: flex;
		align-content: center;
	}

	.tool-icon {
		height: 1.75rem;
	}
</style>
