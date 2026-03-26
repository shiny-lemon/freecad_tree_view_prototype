<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import Part from './Part.svelte';
	import { documentIcon, documentType, displayType, type Document } from '$lib/project/document';
	import { project } from '$lib/data/data.svelte';

	interface Props {
		items: Document[];
	}

	const { items }: Props = $props();
</script>

<div class="part-list">
	<button class="new-part icon" popovertarget="add-part-popover">
		<Plus />
	</button>

	<div class="add-part overlay" id="add-part-popover" popover="auto">
		<fieldset>
			<legend>New document</legend>

			<ol class="new-part-list">
				{#each Object.values(documentType) as type}
					{#await documentIcon(type) then src}
						<li>
							<button class="part-option">
								<img {src} alt="" />
								{displayType(type)}
							</button>
						</li>
					{/await}
				{/each}
			</ol>
		</fieldset>
	</div>

	{#each items as item}
		{#await documentIcon(item.type) then documentIconSrc}
			<Part
				name={item.name}
				image={item.thumbnail}
				documentIcon={documentIconSrc}
				onclick={() => (project.selected = item)}
			/>
		{/await}
	{/each}
</div>

<style>
	.new-part {
		height: 58px;
		aspect-ratio: 1;
	}

	#add-part-popover {
		margin: 4px;
		inset: auto;
		position-area: block-end span-inline-end;
	}
	#add-part-popover > fieldset {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.new-part-list {
		list-style: none;
		padding: 0;
	}
	.add-part:not(:hover) .new-part-list > li:nth-child(even) {
		background-color: var(--background-0);
	}

	.part-option {
		width: 100%;

		display: flex;
		justify-content: start;
		align-items: center;
		gap: 4px;
		padding: 4px;
		border: none;

		background-color: transparent;
	}
	.part-option:hover {
		background-color: var(--background-0);
	}

	.part-option > img {
		height: 2rem;
	}

	.part-list {
		width: 85px;

		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		background-color: var(--background-1);
	}
</style>
