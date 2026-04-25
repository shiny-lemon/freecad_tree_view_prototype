<script lang="ts">
	import { ListFilter, Pin, PinOff } from '@lucide/svelte';
	import { entryCategoryDisplayName, type Entry } from '$lib/project/entry';
	import IconToggle from '$lib/IconToggle.svelte';
	import { documentTypeEntryCategory, type Document } from '$lib/project/document';
	import TreeRoot from './TreeRoot.svelte';

	interface Props {
		entries: Entry[];
		selectedDocument: Document;
	}

	let { entries, selectedDocument }: Props = $props();
</script>

<div class="tree">
	<div class="top">
		<button class="icon">
			<IconToggle
				Checked={Pin}
				Unchecked={PinOff}
				size={24}
				bind:checked={selectedDocument.pinned} // TODO getter selec...pinned and setter with transaction
			/>
		</button>

		<h1>
			{selectedDocument.name}
		</h1>
		<button class="icon" id="filter-anchor" popovertarget="filter-popover">
			<ListFilter size={20} />
		</button>
		<div class="filter-popup overlay" id="filter-popover" popover="auto">
			<form
				action="#"
				onchange={({ target }) => {
					const filterBy = target?.value as string;
					console.log('Filter set to:', filterBy);
					console.info('Filter not implemented. Needs filter category data structure in entry.ts');
				}}
			>
				<!-- onchange={({ target }) => (filtered = target?.value)} -->
				<fieldset>
					<legend>Show</legend>

					<li>
						<input type="radio" id="all" name="filter" value="all" checked />
						<label for="all">All</label>
					</li>

					{#each documentTypeEntryCategory[selectedDocument.type] as category}
						<li>
							<input type="radio" id={category} name="filter" value={category} checked />
							<label for={category}>{entryCategoryDisplayName[category]}</label>
						</li>
					{/each}

					<li>
						<input type="radio" id="issues" name="filter" value="issues" />
						<label for="issues">Issues</label>
					</li>
				</fieldset>
			</form>
		</div>
	</div>

	{#snippet fallback()}
		{#if entries.length === 0}
			<div>Nothing to see here...</div>

			<small>Click something in the toolbar to start.</small>
		{/if}
	{/snippet}

	<TreeRoot bind:entries {fallback} />
</div>

<style>
	.tree {
		flex: 1;

		display: flex;
		flex-direction: column;

		min-width: 0;
	}

	#filter-popover {
		margin: 8px 0;
		inset: auto;
		position-area: block-end span-inline-end;
		padding: 0;
	}

	fieldset li {
		flex: 1;

		display: flex;
		align-items: center;
		gap: 8px;

		padding: 8px;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0.75rem;
	}

	h1 {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
</style>
