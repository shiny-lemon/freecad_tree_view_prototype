<script lang="ts">
	import { getDocuments, getSelected } from '$lib/data/data.svelte';
	import Editor from '$lib/editor/Editor.svelte';
	import PartList from '$lib/parts/PartList.svelte';
	import {
		documentTypeDisplayName,
		documentTypeWorkbenches,
		documentTools,
		getFocusedEntries
	} from '$lib/project/document';
	import Tree from '$lib/tree/Tree.svelte';
	import { fly } from 'svelte/transition';
	import Workbenches from '$lib/Workbenches.svelte';
	import { entryTypeIcon } from '$lib/project/entry';

	// Std
	import coordinateSystem from '$lib/assets/tools/coordinate-system.svg';
	import group from '$lib/assets/tools/group.svg';
	import linkMake from '$lib/assets/tools/link-make.svg';

	const selectedDocumentType = $derived(getSelected().type);
</script>

<div class="app">
	<header>
		<div class="workbenches-container">
			{#if selectedDocumentType}
				{#key selectedDocumentType}
					<div class="workbenches" transition:fly={{ y: 48 }}>
						<h2 class="document-type">
							{documentTypeDisplayName[selectedDocumentType]}
						</h2>
						<Workbenches names={documentTypeWorkbenches[selectedDocumentType]} />
					</div>
				{/key}
			{/if}
		</div>
		<div class="toolbar">
			<div class="std">
				<button class="icon"> <img src={coordinateSystem} alt="" /></button>
				<button class="icon"> <img src={group} alt="" /></button>
				<button class="icon"> <img src={linkMake} alt="" /></button>
			</div>
			<div class="workbench">
				{#each documentTools(selectedDocumentType) as tool}
					{#await import(`$lib/assets/tools/${entryTypeIcon[tool]}.svg`) then { default: src }}
						<button class="icon"> <img {src} alt="" /></button>
					{/await}
				{/each}
			</div>
		</div>
	</header>
	<main>
		<div class="pane">
			<PartList items={getDocuments()} />
			<Tree entries={getSelected().entries} selectedDocument={getSelected()} />
		</div>
		<Editor positionAnchor="--main-pane" selectedEntries={getFocusedEntries(getSelected())} />
		<div class="view">
			<span class="info"
				>FreeCAD Tree View Prototype • <a
					href="https://github.com/shiny-lemon/freecad_tree_view_prototype"
					target="_blank">Read More on GitHub</a
				></span
			>
		</div>
	</main>
</div>

<style>
	.app {
		height: 100vh;
		width: 100vw;

		display: flex;
		flex-direction: column;
	}

	header {
		width: 100vw;

		font-size: 0.6875rem;

		border-bottom: 2px solid var(--subtext-1);
	}

	.document-type {
		font-size: 1.5rem;
	}

	.workbenches {
		height: 48px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.workbenches-container {
		display: grid;
		padding: 0.25rem 0.5rem;
		overflow: hidden;
	}
	.workbenches {
		grid-column: 1;
		grid-row: 1;
	}

	main {
		flex: 1;
		width: 100vw;
		display: flex;

		overflow-y: hidden;

		.pane {
			width: 24rem;
			max-height: 100vh;

			display: flex;

			anchor-name: --main-pane;

			border-right: 2px solid var(--subtext-0);
		}

		.view {
			flex: 1;
			overflow: hidden;
		}
	}

	.view > .info {
		position: absolute;
		right: 0;
		bottom: 0;
		margin: 0.5rem;
	}

	.toolbar {
		display: flex;
		gap: 1rem;

		margin: 0.75rem 1.5rem;
	}
	.toolbar .icon > img {
		height: 2rem;
	}
</style>
