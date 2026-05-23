<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import Part from './Part.svelte';
	import {
		documentType,
		documentTypeDisplayName,
		documentTypeIcon,
		newDocument,
		type Document,
		type DocumentId,
		type DocumentType
	} from '$lib/project/document';
	import { addDocument, focusDocument } from '$lib/data/data.svelte';
	import { dataDragPosition, draggerIndicatorActive, dragType } from '$lib/project/drag';

	interface Props {
		items: Document[];
	}

	const { items }: Props = $props();

	const onnewdocument = (givenType: DocumentType) => {
		// Name should probably be undefined (type not string)
		const document = newDocument(givenType, `Unnamed ${givenType}`);
		addDocument(document);
		focusDocument(document.id);
	};

	const onpartclick = (id: DocumentId) => focusDocument(id);
</script>

{#if draggerIndicatorActive(dragType.PART)}
	<div class="dragger-indicator" data-drag-position={dataDragPosition()}></div>
{/if}

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
	{#each items.filter(({ pinned }) => pinned) as item}
		{@render part(item)}
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

	<div class="parts">
		{#each items.filter(({ pinned }) => !pinned) as item}
			{@render part(item)}
		{/each}
	</div>
</div>

<style>
	.new-part {
		height: 58px;
		aspect-ratio: 1;
	}

	.parts {
		flex: 1;

		width: 85px;

		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		overflow-y: scroll;
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
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 8px;

		padding: 16px 0;

		background-color: var(--background-1);
	}

	.dragger-indicator {
		position: absolute;
		position-anchor: --hovered-part;

		background-color: var(--contrast);
		height: 0.25rem;
		width: 4rem;
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
</style>
