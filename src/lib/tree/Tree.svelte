<script lang="ts">
	import { ListFilter, Pin, PinOff } from '@lucide/svelte';
	import {
		createEntry,
		entryFilterDisplayName,
		entryFilterFunction,
		entryType,
		type Entry,
		type EntryFilter
	} from '$lib/project/entry';
	import IconToggle from '$lib/IconToggle.svelte';
	import { documentTypeEntryFilter, type Document } from '$lib/project/document';
	import TreeRoot from './TreeRoot.svelte';
	import { getFilterFunction, setFilterFunction, setPinned } from '$lib/data/data.svelte';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		entries: Entry[];
		selectedDocument: Document;
	}

	let { entries, selectedDocument }: Props = $props();

	const filterFunction = $derived(getFilterFunction(selectedDocument.id));
	const shownEntries = $derived.by(() => {
		// This only goes one layer down, but for the prototype, this is fine.

		const topLevelEntries = entries.filter((value) => {
			return filterFunction(value);
		});

		if (topLevelEntries.length >= 1) return topLevelEntries;

		const entriesChildren = entries.reduce<Entry[]>((allChildren, current) => {
			const filteredChildren = current.children?.filter((value) => filterFunction(value)) || [];
			if (current.children) allChildren.push(...filteredChildren);
			return allChildren;
		}, []);

		if (entriesChildren.length >= 1) return entriesChildren;

		return [];
	});

	const onfilterchange: FormEventHandler<HTMLFormElement> = (event) => {
		const filter = (event.target as HTMLInputElement)?.value as EntryFilter;
		setFilterFunction(selectedDocument.id, entryFilterFunction[filter]);
	};
</script>

<div class="tree">
	<div class="top">
		<button class="icon">
			<IconToggle
				Checked={Pin}
				Unchecked={PinOff}
				size={24}
				bind:checked={
					() => selectedDocument.pinned, (value) => setPinned(selectedDocument.id, value)
				}
			/>
		</button>

		<h1>
			{selectedDocument.name}
		</h1>
		<button class="icon" id="filter-anchor" popovertarget="filter-popover">
			<ListFilter size={20} />
		</button>
		<div class="filter-popup overlay" id="filter-popover" popover="auto">
			<form action="#" onchange={onfilterchange}>
				<fieldset>
					<legend>Show</legend>

					{#each documentTypeEntryFilter[selectedDocument.type] as category}
						<li>
							<input type="radio" id={category} name="filter" value={category} checked />
							<label for={category}>{entryFilterDisplayName[category]}</label>
						</li>
					{/each}
				</fieldset>
			</form>
		</div>
	</div>

	{#snippet fallback()}
		{#if entries.length === 0}
			<div>Nothing to see here...</div>

			<small>Click something in the toolbar to start.</small>
		{:else if shownEntries.length === 0}
			<div>Filter shows nothing.</div>

			<small>Choose a different filter above.</small>
		{/if}
	{/snippet}

	<TreeRoot entries={shownEntries} {fallback} {selectedDocument} />
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
