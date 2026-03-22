<script lang="ts">
	import { Box, Drill, House, Link, Plus, StickyNote, Table2 } from '@lucide/svelte';
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

	<div class="add-part" id="add-part-popover" popover="auto">
		<fieldset>
			<legend>New document</legend>

			{#each Object.values(documentType) as type}
				{@const DocumentIcon = documentIcon(type)}
				<button class="part-option">
					<DocumentIcon />
					{displayType(type)}
				</button>
			{/each}
		</fieldset>
	</div>

	{#each items as item}
		<Part
			name={item.name}
			image={item.thumbnail}
			DocumentIcon={documentIcon(item.type)}
			onclick={() => (project.selected = item)}
		/>
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

		border-radius: 4px;
		border: none;
		background-color: var(--overlay-2);
		color: var(--base);
	}
	#add-part-popover > fieldset {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.part-option {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 4px;
		padding: 4px;
		border-radius: 4px;
		border: none;

		color: var(--base);
		background-color: var(--subtext-0);
	}
	.part-option:hover {
		background-color: var(--subtext-1);
	}

	.part-list {
		width: 85px;

		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		border: 0;
		border-right: 1px;
		border-style: solid;
		border-color: var(--surface-0);
	}
</style>
