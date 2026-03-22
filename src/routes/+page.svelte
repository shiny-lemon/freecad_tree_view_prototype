<script lang="ts">
	import { project } from '$lib/data/data.svelte';
	import Editor from '$lib/editor/Editor.svelte';
	import PartList from '$lib/parts/PartList.svelte';
	import { displayType, documentTypeWorkbenches } from '$lib/project/document';
	import Tree from '$lib/tree/Tree.svelte';
	import { Minus, Square, X } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import Workbenches from '../lib/Workbenches.svelte';

	const documentType = $derived(project.selected?.type);
</script>

{#snippet topBar()}
	<div class="top-bar">
		<div class="menu-items">
			<img src="src/lib/assets/favicon.svg" alt="" height="14" />
			<span>File</span>
			<span>Edit</span>
			<span>Window</span>
			<span>Help</span>
		</div>
		<span class="project-name">*{project.name}</span>
		<div class="window-controls">
			<Minus size={14} />
			<Square size={14} />
			<X size={14} />
		</div>
	</div>
{/snippet}

<div class="app">
	<header>
		{@render topBar()}
		{#if documentType}
			<div class="workbenches-container">
				{#key documentType}
					<div class="workbenches" transition:fly={{ y: 48 }}>
						<h2 class="document-type">
							{displayType(documentType)}
						</h2>
						<Workbenches names={documentTypeWorkbenches[documentType]} />
					</div>
				{/key}
			</div>
		{/if}
		<div class="toolbar">
			<button>PAD</button>
			<button>REVOLVE</button>
			<button>SKETCH</button>
		</div>
	</header>
	<main>
		<div class="pane">
			<PartList items={project.documents} />
			<Tree />
		</div>
		<Editor positionAnchor="--main-pane" active={true} />
		<div class="view">
			<h1>NEXT UP: ENTRIES AND FILTERS (PREV: FEATURES DRAG)</h1>
			<p>
				Make filters inheritnly in the entries method. Also make the entries method generic and just
				dependent on this.type
			</p>
		</div>
	</main>
	<footer>
		<span>FreeCAD Tree View Prototype • <a href="about:blank">Read More on GitHub</a></span>
	</footer>
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
		background-color: var(--base);

		font-size: 0.6875rem;

		.top-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0px 4px;

			height: 24px;
			background-color: var(--crust);
			color: var(--overlay-1);

			.menu-items {
				display: flex;
				align-items: center;
				gap: 1rem;
				color: var(--subtext-0);
			}
		}

		.project-name {
			font-weight: 600;
		}
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
		background-color: var(--mantle);

		.pane {
			width: 24rem;
			margin: 8px;
			border-radius: 4px;

			display: flex;

			background-color: var(--base);

			anchor-name: --main-pane;
		}

		.view {
			flex: 1;
		}
	}
	footer {
		height: 24px;
		width: 100vw;
		background-color: var(--crust);
		display: flex;
		justify-content: center;
	}
</style>
