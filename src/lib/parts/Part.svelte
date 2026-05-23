<script lang="ts">
	import { getSelected } from '$lib/data/data.svelte';
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import type { DocumentId } from '$lib/project/document';
	import { dragClasses, dragEventHandlers, dragType } from '$lib/project/drag';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		id: DocumentId;
		name: string;
		image: string | null;
		onclick: MouseEventHandler<HTMLButtonElement> | null | undefined;
		documentIcon: string;
	}

	const { id, name, image, onclick, documentIcon }: Props = $props();

	const selectedId = getSelected().id;

	const anchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();
</script>

<div
	class={{
		'part-item': true,
		selected: id === selectedId,
		...dragClasses(id)
	}}
	draggable="true"
	style:--anchor-name={anchorName}
	{...fleetingAnchorEvents}
	tabindex="-1"
	{...dragEventHandlers(dragType.PART, id)}
>
	<div id="name-popover" popover="hint" {@attach fleetingTarget}>
		<span>{name}</span>
	</div>

	<button class="icon" {onclick}>
		{#if image != null}
			<img class="thumbnail" src={image} alt="" />
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
