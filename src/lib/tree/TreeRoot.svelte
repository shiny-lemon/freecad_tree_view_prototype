<script lang="ts">
	import {
		positionRelation,
		type Entry,
		type Position,
		type PositionRelation
	} from '$lib/project/entry';
	import type { DragEventHandler } from 'svelte/elements';
	import TreeEntry from './TreeEntry.svelte';
	import type { Snippet } from 'svelte';
	import { newAnchorName } from '$lib/popover';

	interface Props {
		entries: Entry[];
		fallback: Snippet;
	}

	const { entries = $bindable(), fallback }: Props = $props();

	// This is very stupid and does not work very well. Need a better solution...
	const createOnNodeDragEnter = (entry: Entry) => {
		return (
			event: Parameters<DragEventHandler<HTMLElement>>[0]
		): ReturnType<DragEventHandler<HTMLElement>> => {
			event.preventDefault();
			setDragOver(entry.id, positionRelation.AFTER);
		};
	};

	// This logic should definitely be hid away in an event listener passed down to the child nodes...
	interface DragOverData {
		entryId: string;
		relation: PositionRelation;
	}
	let dragOverData: DragOverData | null = $state(null);
	const setDragOver = (entryId: string, relation: PositionRelation) =>
		(dragOverData = { entryId, relation });

	interface NodeSelection {
		anchor: Position;
		focus: Position;
	}
	const nodeSelection: NodeSelection | null = $state(null);
	const tipPosition = $derived(entries.at(-1)?.id);
</script>

{#if dragOverData !== null}
	<div class="dragger-indicator"></div>
{/if}

<div class="tip-indicator" style:--anchor-name={newAnchorName(tipPosition)}>
	<div class="stick"></div>
	<div class="handle">
		<div class="grab-indicator"></div>
		<div class="grab-indicator"></div>
	</div>
</div>

<ul class="nodes" role="tree" tabindex="-1">
	{#each entries as entry, index}
		<TreeEntry
			bind:entry={entries[index]}
			onnodedragenter={createOnNodeDragEnter(entry)}
			draggingOver={entry.id === dragOverData?.entryId}
			selected={false}
		/>
	{/each}

	{@render fallback()}
</ul>

<style>
	.nodes {
		flex: 1;
		padding: 0.25rem 1rem;
	}

	.dragger-indicator {
		position: absolute;
		position-anchor: --my-anchor;
		position-area: bottom;

		background-color: var(--contrast);
		height: 0.25rem;
		width: 18rem;
	}

	.tip-indicator {
		width: 18rem;

		display: flex;
		align-items: center;
		gap: 4px;

		position-anchor: var(--anchor-name);
		position-area: bottom;

		position: absolute;

		margin: -12px;
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
