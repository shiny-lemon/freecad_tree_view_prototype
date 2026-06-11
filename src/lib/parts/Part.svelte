<script lang="ts">
	import { getSelected } from '$lib/data/data.svelte';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import type { DocumentId } from '$lib/project/document';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		id: DocumentId;
		name: string;
		image: string | null;
		onclick: MouseEventHandler<HTMLButtonElement> | null | undefined;
		documentIcon: string;
	}

	const { id, name, image, onclick, documentIcon }: Props = $props();

	const isSelected = (id: DocumentId) => {
		const selected = getSelected();
		return selected !== null && id === selected.id;
	};

	const anchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();
</script>

<div
	class={{
		'part-item': true,
		selected: isSelected(id)
	}}
	draggable="true"
	style:--anchor-name={anchorName}
	{...fleetingAnchorEvents}
	tabindex="-1"
>
	<div id="name-popover" popover="hint" {@attach fleetingTarget}>
		<span>{name}</span>
	</div>

	<button class="icon" {onclick}>
		{#if image != null}
			{#await import(`$lib/assets/thumbnails/${image}.png`) then { default: src }}
				<img class="thumbnail" {src} alt="" />
			{/await}
		{:else}
			<img class="thumbnail fallback" src={documentIcon} alt="" />
		{/if}
	</button>
</div>

<style>
	.part-item {
		height: 58px;
		aspect-ratio: 1;
		flex-shrink: 0;

		border-radius: 4px;
		overflow: hidden;

		display: flex;
		justify-content: center;
		align-items: center;

		anchor-name: var(--anchor-name);
	}
	.part-item:focus-within {
		outline: 2px var(--contrast) solid;
	}
	.part-item.hovered {
		anchor-name: --hovered-part;
	}

	.thumbnail {
		height: 58px;
		background-color: var(--surface-0);
	}
	.thumbnail.fallback {
		height: 48px;
		padding: 12px;
	}

	#name-popover {
		position-anchor: var(--anchor-name);
		position: absolute;
		position-area: center inline-end;

		font-size: 1rem;
		font-family: inherit;

		background-color: var(--surface-0);
		border: none;
		border-radius: 4px;

		margin-left: 4px;
	}
</style>
