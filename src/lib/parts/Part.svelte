<script lang="ts">
	import { newAnchorName } from '$lib/popover';
	import { newFleetingPopover } from '$lib/popover/fleeting.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		name: string;
		image: string | null;
		onclick: MouseEventHandler<HTMLButtonElement> | null | undefined;
		documentIcon: string;
	}

	const { name, image, onclick, documentIcon }: Props = $props();

	const anchorName = newAnchorName();
	const { fleetingAnchorEvents, fleetingTarget } = newFleetingPopover();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="part-item" style:--anchor-name={anchorName} {...fleetingAnchorEvents} tabindex="-1">
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
