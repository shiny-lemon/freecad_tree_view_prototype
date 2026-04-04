<script lang="ts">
	import { ListFilter, Pin } from '@lucide/svelte';
	import TreeNode from './TreeNode.svelte';
	import type { DragEventHandler } from 'svelte/elements';
	import {
		entryCategoryDisplayName,
		entryTypeCategory,
		type Entry,
		type EntryCategory
	} from '$lib/project/entry';
	import EditableDiv from '$lib/EditableDiv.svelte';

	interface Props {
		entries: Entry[];
		selectedName: string;
	}

	const { entries, selectedName }: Props = $props();

	let draggerPositionY: number | null = $state(null);
	const ondragover: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) throw new Error('No data from drag over.');

		// const draggingPastEntry = findEntry(event.target as Element);

		// if (draggingPastEntry === undefined) return;

		// const draggingPastNode = findElement(draggingPastEntry);

		// if (draggingPastNode === undefined) throw new Error('Uhhh, something went wrong.');

		// const { top, bottom } = draggingPastNode.getBoundingClientRect();

		// const middleYPixels = (top + bottom) / 2;
		// const positionYPixels = event.clientY >= middleYPixels ? bottom : top;

		// draggerPositionY = positionYPixels;
	};

	const ondrop: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();

		// if (event.target === null) return;

		// const entry = findEntry(event.target as Element);

		// if (entry === undefined) throw Error('No entry found in drop.');

		// const draggendEntryPositionString = event.dataTransfer?.getData('text/plain');
		// const draggenEntryPosition = Number(draggendEntryPositionString);

		// const entryPosition = findIndex(entries, entry);

		// if (draggerPositionY !== null) {
		// 	// Hide dragger when dropped.
		// 	draggerPositionY = null;
		// }

		// console.log('From: ', draggenEntryPosition, ' to: ', entryPosition);
		// move(entries, draggenEntryPosition, entryPosition);
	};

	const findAvailableCategories = (entries: Entry[]): EntryCategory[] => {
		const categories: EntryCategory[] = [];
		entries.forEach((entry) => {
			const category = entryTypeCategory[entry.type];

			if (categories.some((value) => value === category)) return;

			categories.push(category);
		});
		return categories;
	};

	const availableEntryCategories = $derived(findAvailableCategories(entries));
</script>

<div class="tree">
	<div class="top">
		<button class="icon">
			<Pin size={24} />
		</button>
		<EditableDiv>
			<h1>
				{selectedName}
			</h1>
		</EditableDiv>
		<button class="icon" id="filter-anchor" popovertarget="filter-popover">
			<ListFilter size={20} />
		</button>
		<div class="filter-popup overlay" id="filter-popover" popover="auto">
			<form action="#">
				<!-- onchange={({ target }) => (filtered = target?.value)} -->
				<fieldset>
					<legend>Show</legend>

					<li>
						<input type="radio" id="all" name="filter" value="all" checked />
						<label for="all">All</label>
					</li>

					{#each availableEntryCategories as category}
						<li>
							<input type="radio" id={category} name="filter" value={category} checked />
							<label for={category}>{entryCategoryDisplayName[category]}</label>
						</li>
					{/each}

					<!--
						<li>
							<input type="radio" id="issues" name="filter" value="issues" />
							<label for="issues">Issues</label>
						</li>
					</ul> -->
				</fieldset>
			</form>
		</div>
	</div>

	{#if draggerPositionY !== null}
		<div class="dragger-indicator" style:top={draggerPositionY + 'px'}></div>
	{/if}
	<div class="tip-indicator">
		<div class="stick"></div>
		<div class="handle">
			<div class="grab-indicator"></div>
			<div class="grab-indicator"></div>
		</div>
	</div>
	<ul class="nodes" role="tree" tabindex="-1" {ondragover} {ondrop}>
		{#each entries as entry, index}
			<TreeNode {entry} {index} />
		{/each}

		{#if entries.length === 0}
			<div>Nothing to see here...</div>
			<!-- <small>No {filterNames[filtered]} in tree.</small> -->
			<small>Click something in the toolbar to start.</small>
		{/if}
	</ul>
</div>

<style>
	.tree {
		flex: 1;

		display: flex;
		flex-direction: column;
	}

	#filter-popover {
		margin: 8px 0;
		inset: auto;
		position-area: block-end span-inline-end;
		padding: 0;
	}

	fieldset li {
		display: flex;
		align-items: center;
		gap: 8px;

		padding: 8px;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0.75rem;
	}

	.nodes {
		flex: 1;
		padding: 0.25rem 1rem;
	}

	.dragger-indicator {
		position: absolute;
		background-color: var(--contrast);
		height: 0.25rem;
		width: 18rem;
	}

	.tip-indicator {
		position: absolute;

		width: 18rem;

		display: flex;
		align-items: center;
		gap: 4px;

		top: 600px;
	}

	.stick {
		background-color: var(--text);
		height: 0.25rem;
		flex: 1;

		border-radius: 4px;
	}

	.handle {
		background-color: var(--text);
		height: 24px;
		width: 36px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2px;
		border-radius: 8px;
	}

	.grab-indicator {
		height: 4px;
		width: 16px;
		background-color: var(--subtext-0);
	}
</style>
