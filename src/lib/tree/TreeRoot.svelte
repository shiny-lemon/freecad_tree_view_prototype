<script lang="ts">
	import { type Entry, type EntryCoordinates } from '$lib/project/entry';
	import TreeEntry from './TreeEntry.svelte';
	import type { Snippet } from 'svelte';
	import { newAnchorName } from '$lib/popover';
	import { isEntrySelected, type Document } from '$lib/project/document';
	import { dataDragPosition, draggerIndicatorActive, dragType } from '$lib/project/drag';
	import type { MouseEventHandler } from 'svelte/elements';
	import { setTipAnchor } from '$lib/data/data.svelte';

	interface Props {
		entries: Entry[];
		selectedDocument: Document;
		fallback: Snippet;
	}

	const { entries, fallback, selectedDocument }: Props = $props();

	$effect(() => {
		const tipAnchorInEntries = entries.some((entry) => entry.id === selectedDocument.tipAnchor);
		if (selectedDocument.tipAnchor !== null && tipAnchorInEntries) return;

		const lastEntry = entries.at(-1);
		if (lastEntry === undefined) {
			setTipAnchor(null);
			return;
		}

		setTipAnchor(lastEntry.id);
	});

	let tipPosition = $state(0);
	let tipClickedTime = $state(0);
	let tipTopOffset = $derived(`${tipPosition}px`);

	const onmousedown: MouseEventHandler<HTMLElement> = (event) => {
		const leftClick = event.buttons === 1;
		if (!leftClick) return;

		tipClickedTime = Date.now();
		tipPosition = event.clientY;
	};

	const onwindowmouseupordown = () => {
		const timeTriggered = Date.now();
		const isDragging = timeTriggered > tipClickedTime + 300;
		if (!isDragging || tipPosition === 0) return;
		ontipstopmove(tipPosition);
		tipPosition = 0;
	};
	const onwindowmousemove: MouseEventHandler<Window> = (event) => {
		if (tipPosition === 0) return;
		tipPosition = event.clientY;
	};

	const distanceBetweenTipAndEntry = (tip: number, coordinates: EntryCoordinates): number => {
		// Seems more intuitive to always pick the bottom distance...
		const bottomDistance = Math.abs(coordinates.bottom - tip);
		return bottomDistance;
	};

	const ontipstopmove = (y: number) => {
		const closestEntry = selectedDocument.entries.reduce((previous, current) => {
			if (previous.coordinates === null || current.coordinates === null)
				throw new Error('Entry has no coordinates.');

			const previousDistance = distanceBetweenTipAndEntry(y, previous.coordinates);
			const currentDistance = distanceBetweenTipAndEntry(y, current.coordinates);

			if (currentDistance < previousDistance) return current;

			return previous;
		});

		setTipAnchor(closestEntry.id);
	};
</script>

<svelte:window
	onmousedown={onwindowmouseupordown}
	onmouseup={onwindowmouseupordown}
	onmousemove={onwindowmousemove}
/>

{#if draggerIndicatorActive(dragType.ENTRY)}
	<div class="dragger-indicator" data-drag-position={dataDragPosition()}></div>
{/if}

{#if selectedDocument.tipAnchor !== null}
	<div
		class={{ 'tip-indicator': true, dragged: tipPosition !== 0 }}
		style:--anchor-name={newAnchorName(selectedDocument.tipAnchor)}
		role="slider"
		aria-valuenow={0}
		{onmousedown}
		tabindex="-1"
		style:top={tipTopOffset}
	>
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

		overflow-y: scroll;
	}

	.dragger-indicator {
		position: absolute;
		position-anchor: --hovered-entry;

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
	.tip-indicator.dragged {
		position-anchor: none;
		user-select: none;
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

		cursor: grab;
	}

	.grab-indicator {
		height: 4px;
		width: 16px;
		background-color: var(--subtext-0);
	}
</style>
