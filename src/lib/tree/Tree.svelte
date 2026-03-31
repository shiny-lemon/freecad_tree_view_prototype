<script lang="ts">
	import { ListFilter } from '@lucide/svelte';
	import TreeNode from './TreeNode.svelte';
	import type { DragEventHandler } from 'svelte/elements';
	import { project } from '$lib/data/data.svelte';
	import { findIndex, move } from '$lib/project/entry';
	import { findElement, findEntry } from './position.svelte';
	import EditableDiv from '$lib/EditableDiv.svelte';

	const entries = $derived(project.selected?.entries() ?? []);

	let draggerPositionY: number | null = $state(null);
	const ondragover: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) throw new Error('No data from drag over.');

		const draggingPastEntry = findEntry(event.target as Element);

		if (draggingPastEntry === undefined) return;

		const draggingPastNode = findElement(draggingPastEntry);

		if (draggingPastNode === undefined) throw new Error('Uhhh, something went wrong.');

		const { top, bottom } = draggingPastNode.getBoundingClientRect();

		const middleYPixels = (top + bottom) / 2;
		const positionYPixels = event.clientY >= middleYPixels ? bottom : top;

		draggerPositionY = positionYPixels;
	};

	const ondrop: DragEventHandler<HTMLElement> = (event) => {
		event.preventDefault();

		if (event.target === null) return;

		const entry = findEntry(event.target as Element);

		if (entry === undefined) throw Error('No entry found in drop.');

		const draggendEntryPositionString = event.dataTransfer?.getData('text/plain');
		const draggenEntryPosition = Number(draggendEntryPositionString);

		const entryPosition = findIndex(entries, entry);

		if (draggerPositionY !== null) {
			// Hide dragger when dropped.
			draggerPositionY = null;
		}

		console.log('From: ', draggenEntryPosition, ' to: ', entryPosition);
		move(entries, draggenEntryPosition, entryPosition);
	};
</script>

<div class="tree">
	<div class="top">
		<EditableDiv>
			<h1>
				{project.selected?.name}
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

					<ul>
						<li>
							<input type="radio" id="features" name="filter" value="BOB" checked />
							<label for="features">All features</label>
						</li>

						<li>
							<input type="radio" id="sketches" name="filter" value="BOB" />
							<label for="sketches">Sketches</label>
						</li>

						<li>
							<input type="radio" id="modelling" name="filter" value="BOB" />
							<label for="modeling">Modelling</label>
						</li>

						<li>
							<input type="radio" id="patterns" name="filter" value="BOB" />
							<label for="patterns">Patterns</label>
						</li>

						<li>
							<input type="radio" id="dress-ups" name="filter" value="BOB" />
							<label for="dress-ups">Dress-ups</label>
						</li>

						<li>
							<input type="radio" id="issues" name="filter" value="issues" />
							<label for="issues">Issues</label>
						</li>
					</ul>
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
			<!-- <small>No {filterNames[filtered]} in tree.</small> -->
			<small>No [ERROR] in tree.</small>
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
