<script lang="ts">
	import { type Entry } from '$lib/project/entry';
	import TreeEntry from './TreeEntry.svelte';
	import type { Snippet } from 'svelte';
	import { newAnchorName } from '$lib/popover';
	import { isEntrySelected, type Document } from '$lib/project/document';
	import { getEntryDragState, getSelected } from '$lib/data/data.svelte';

	interface Props {
		entries: Entry[];
		selectedDocument: Document;
		fallback: Snippet;
	}

	const { entries, fallback, selectedDocument }: Props = $props();

	const tipPosition = $derived(entries.at(-1)?.id);
</script>

{#if getSelected().drag.entry.lastHovered !== null}
	<div class="dragger-indicator" data-drag-position={getEntryDragState().lastPosition}></div>
{/if}

{#if tipPosition !== undefined}
	<div class="tip-indicator" style:--anchor-name={newAnchorName(tipPosition)}>
		<div class="stick"></div>
		<div class="handle">
			<div class="grab-indicator"></div>
			<div class="grab-indicator"></div>
		</div>
	</div>
{/if}

<ul class="nodes" role="tree" tabindex="-1">
	{@render fallback()}

	{#each entries as entry, index (entry.id)}
		<TreeEntry entry={entries[index]} selected={isEntrySelected(entry.id, selectedDocument)} />
	{/each}
</ul>

<style>
	.nodes {
		flex: 1;
		padding: 0.25rem 1rem;
	}

	.dragger-indicator {
		position: absolute;
		position-anchor: --my-anchor;

		background-color: var(--contrast);
		height: 0.25rem;
		width: 18rem;
	}
	.dragger-indicator[data-drag-position='top'] {
		position-area: top;
	}
	.dragger-indicator[data-drag-position='center'] {
		visibility: hidden;
	}
	.dragger-indicator[data-drag-position='bottom'] {
		position-area: bottom;
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
