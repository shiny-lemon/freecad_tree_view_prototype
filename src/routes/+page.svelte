<script lang="ts">
	import Editor from '$lib/editor/Editor.svelte';
	import {
		blurDocumentSelection,
		getDocument,
		getDocuments,
		getDocumentSearchValue,
		getHistory,
		getSelected,
		setDocumentSearchValue
	} from '$lib/data/data.svelte';
	import {
		getFocusedEntries,
		type FilterIssue,
		filterIssue,
		applyFilter
	} from '$lib/project/document';
	import Tree from '$lib/tree/Tree.svelte';
	import { LayoutGrid, LayoutList, List, Search } from '@lucide/svelte';
	import TreeDocuments from '$lib/tree/TreeDocuments.svelte';
	import TreeRoot from '$lib/tree/TreeRoot.svelte';

	const selected = $derived(getSelected());

	const searchedDocuments = $derived(
		getDocuments().filter((value) =>
			value.name.toLowerCase().includes(getDocumentSearchValue().toLowerCase())
		)
	);

	const createFilters = (isSelected: boolean) => {
		if (isSelected) return;
	};
	const filters = $derived(createFilters(selected !== null));
</script>

{#snippet topLeft()}
	{#if selected}
		<button class="icon" onclick={() => blurDocumentSelection()}>
			<!-- <ArrowLeft /> -->
			<!-- <ArrowLeftToLine /> -->
		</button>

		<h1>
			{selected.name}
		</h1>
	{:else}
		<label class="search-label">
			<Search />
			<input
				type="search"
				name="searchbar"
				id="searchbar"
				placeholder="search documents"
				bind:value={getDocumentSearchValue, setDocumentSearchValue}
			/>
		</label>
	{/if}
{/snippet}

{#snippet content()}
	{#if selected}
		{#snippet fallback(issue: FilterIssue | null)}
			{#if issue === filterIssue.NO_ENTRIES}
				<div>Nothing to see here...</div>

				<small>Click something in the toolbar to start.</small>
			{:else if issue === filterIssue.NO_ENTRIES_IN_FILTER}
				<div>Filter shows nothing.</div>

				<small>Choose a different filter above.</small>
			{/if}
		{/snippet}

		<TreeRoot entries={applyFilter(selected)} {fallback} />
	{:else}
		<TreeDocuments documents={searchedDocuments} />
	{/if}
{/snippet}

{#snippet bottom()}
	<div class="list-options">
		<span class="info">43 documents</span>

		<span class="toggle">
			<List />
			<LayoutList />
			<LayoutGrid />
		</span>
	</div>
{/snippet}

<div class="app">
	<div class="pane">
		<Tree {topLeft} {content} {bottom} filters={[{ id: 'string', name: 'Strign' }]} />
	</div>
	{#if selected}
		<Editor positionAnchor="--main-pane" selectedEntries={getFocusedEntries(selected)} />
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
	}

	.pane {
		flex: 1;
		height: 100%;
		width: 18.75rem;

		display: flex;

		anchor-name: --main-pane;

		border-right: 2px solid var(--subtext-0);
	}

	h1 {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.search-label {
		display: flex;
		gap: 0.25rem;
	}
</style>
