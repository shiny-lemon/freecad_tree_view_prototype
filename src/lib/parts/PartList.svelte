<script lang="ts">
	import { Grip } from '@lucide/svelte';
	import Part from './Part.svelte';
	import { documentTypeIcon, type Document, type DocumentId } from '$lib/project/document';
	import {
		blurDocumentSelection,
		getSelected,
		resetToHome,
		selectDocument
	} from '$lib/data/data.svelte';

	interface Props {
		items: Document[];
	}

	const { items }: Props = $props();

	const onpartclick = (id: DocumentId) => selectDocument(id);
</script>

{#snippet part(item: Document)}
	<Part
		id={item.id}
		name={item.name}
		image={item.thumbnail}
		documentIcon={documentTypeIcon[item.type] + '.svg'}
		onclick={() => onpartclick(item.id)}
	/>
{/snippet}

<div class="part-list">
	<button class="new-part icon" popovertarget="add-part-popover" onclick={() => resetToHome()}>
		<Grip />
	</button>

	<div class="slots">
		{#each items as item}
			{@render part(item)}
		{/each}
	</div>
</div>

<style>
	.new-part {
		height: 58px;
		aspect-ratio: 1;
	}
	.new-part:disabled {
		color: grey;
	}
	.new-part:disabled:hover {
		background-color: transparent;
		cursor: not-allowed;
	}

	.slots {
		flex: 1;

		width: 85px;

		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		overflow-y: scroll;
	}

	.part-list {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		background-color: var(--background-1);
	}
</style>
