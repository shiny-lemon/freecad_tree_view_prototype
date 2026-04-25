<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import Part from './Part.svelte';
	import {
		documentType,
		documentTypeDisplayName,
		documentTypeIcon,
		newDocument,
		type Document,
		type DocumentType
	} from '$lib/project/document';
	import { project } from '$lib/data/data.svelte';

	interface Props {
		items: Document[];
	}

	const { items }: Props = $props();

	const onnewdocument = (givenType: DocumentType) => {
		// Name should probably be undefined (type not string)
		const document = newDocument(givenType, `Unnamed ${givenType}`);
		project.documents.push(document);
	};
</script>

<div class="part-list">
	{#each items.filter(({ pinned }) => pinned) as item}
		<Part
			name={item.name}
			image={item.thumbnail}
			documentIcon={documentTypeIcon[item.type] + '.svg'}
			onclick={() => (project.selected = item)}
		/>
	{/each}

	<button class="new-part icon" popovertarget="add-part-popover">
		<Plus />
	</button>

	<div class="add-part overlay" id="add-part-popover" popover="auto">
		<fieldset>
			<legend>New document</legend>

			<ol class="new-part-list">
				{#each Object.values(documentType) as type}
					<li>
						<button class="part-option" onclick={() => onnewdocument(type)}>
							<img src={documentTypeIcon[type] + '.svg'} alt="" />
							{documentTypeDisplayName[type]}
						</button>
					</li>
				{/each}
			</ol>
		</fieldset>
	</div>

	{#each items.filter(({ pinned }) => !pinned) as item}
		<Part
			name={item.name}
			image={item.thumbnail}
			documentIcon={documentTypeIcon[item.type] + '.svg'}
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
