<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	// Std
	import coordinateSystem from '$lib/assets/tools/coordinate-system.svg';
	import group from '$lib/assets/tools/group.svg';
	import linkMake from '$lib/assets/tools/link-make.svg';
	import {
		getDocument,
		getHistory,
		getSelected,
		project,
		pushHistory
	} from '$lib/data/data.svelte';
	import {
		documentTools,
		documentTypeDisplayName,
		documentTypeWorkbenches,
		type Document,
		type DocumentType
	} from '$lib/project/document';
	import Workbenches from '$lib/Workbenches.svelte';
	import { fly } from 'svelte/transition';
	import { entryTypeIcon } from '$lib/project/entry.js';
	import type { LayoutProps } from './$types';
	import PartList from '$lib/parts/PartList.svelte';
	import { setSelectedDocumentContext } from '$lib/project/context';

	let { children }: LayoutProps = $props();

	setSelectedDocumentContext(() => {
		const selected = getSelected();
		if (selected) return selected;
		throw new Error('No document selected.');
	});

	const selectedDocumentType: DocumentType | null = $derived(getSelected()?.type || null);

	$effect(() => {
		const selected = getSelected();
		if (!selected || getHistory().at(-1) === selected.id) return;
		pushHistory(selected.id);
	});

	const recentDocuments = $derived(
		getHistory()
			.map((id) => getDocument(id))
			.reduce<Document[]>((previous, document) => {
				const documentIsAlreadyInPrevious = previous.some(({ id }) => id === document.id);
				if (documentIsAlreadyInPrevious) return previous;
				return [...previous, document];
			}, [])
			.reverse()
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="wrapper">
	<header>
		<div class="workbenches-container">
			{#key selectedDocumentType}
				<div class="workbenches" transition:fly={{ y: 48 }}>
					<h2 class="document-type">
						{#if selectedDocumentType != null}
							{documentTypeDisplayName[selectedDocumentType]}
						{/if}
					</h2>
					{#if selectedDocumentType != null}
						<Workbenches names={documentTypeWorkbenches[selectedDocumentType]} />
					{/if}
				</div>
			{/key}
		</div>
		<div class="toolbar">
			<div class="std">
				<button class="icon"> <img src={coordinateSystem} alt="" /></button>
				<button class="icon"> <img src={group} alt="" /></button>
				<button class="icon"> <img src={linkMake} alt="" /></button>
			</div>
			<div class="workbench">
				{#if selectedDocumentType !== null}
					{#each documentTools(selectedDocumentType) as tool}
						{#await import(`$lib/assets/tools/${entryTypeIcon[tool]}.svg`) then { default: src }}
							<button class="icon"> <img {src} alt="" /></button>
						{/await}
					{/each}
				{/if}
			</div>
		</div>
	</header>
	<main>
		<div class="left">
			<PartList items={recentDocuments} />
		</div>
		{@render children()}
	</main>
	<div class="view">
		<span class="info"
			>FreeCAD Tree View Prototype • <a
				href="https://github.com/shiny-lemon/freecad_tree_view_prototype"
				target="_blank">Read More on GitHub</a
			></span
		>
	</div>
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	header {
		width: 100vw;

		font-size: 0.6875rem;

		border-bottom: 2px solid var(--subtext-1);
	}

	main {
		display: flex;
		flex-grow: 1;
		overflow: auto;
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

	.toolbar {
		display: flex;
		gap: 1rem;

		margin: 0.75rem 1.5rem;
	}
	.toolbar .icon > img {
		height: 2rem;
	}

	.left {
		display: flex;
	}

	/* .view {
	} */
	.view > .info {
		position: absolute;
		right: 0;
		bottom: 0;
		margin: 0.5rem;
	}
</style>
