<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		name: string;
		image: string | null;
		onclick: MouseEventHandler<HTMLButtonElement> | null | undefined;
		documentIcon: string;
	}

	const { name, image, onclick, documentIcon }: Props = $props();

	let namePopover: HTMLDivElement | null = $state(null);

	const show = () => {
		namePopover?.showPopover();
	};
	const hide = () => {
		namePopover?.hidePopover();
	};

	const anchorName = '--' + crypto.randomUUID();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<button
	class="part-item icon"
	style:--anchor-name={anchorName}
	onmouseover={show}
	onmouseleave={hide}
	onfocus={show}
	onblur={hide}
	{onclick}
>
	{#if image != null}
		<img class="thumbnail" src={image} alt="" />
	{:else}
		<img class="thumbnail fallback" src={documentIcon} alt="" />
	{/if}

	<div id="name-popover" popover="hint" bind:this={namePopover}>
		<span>{name}</span>
	</div>
</button>

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
