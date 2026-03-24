<script lang="ts">
	import { project } from '$lib/data/data.svelte';
	import Editor from '$lib/editor/Editor.svelte';
	import PartList from '$lib/parts/PartList.svelte';
	import { displayType, documentTypeWorkbenches } from '$lib/project/document';
	import Tree from '$lib/tree/Tree.svelte';
	import { fly } from 'svelte/transition';
	import Workbenches from '../lib/Workbenches.svelte';

	// Std
	import coordinateSystem from '$lib/assets/tools/std/coordinate-system.svg';
	import group from '$lib/assets/tools/std/group.svg';
	import linkMake from '$lib/assets/tools/std/link-make.svg';

	// Part design
	import body from '$lib/assets/tools/part-design/body.svg';
	import newSketch from '$lib/assets/tools/part-design/new-sketch.svg';
	import pad from '$lib/assets/tools/part-design/pad.svg';
	import revolution from '$lib/assets/tools/part-design/revolution.svg';
	import additiveLoft from '$lib/assets/tools/part-design/additive-loft.svg';
	import additivePipe from '$lib/assets/tools/part-design/additive-pipe.svg';
	import pocket from '$lib/assets/tools/part-design/pocket.svg';
	import hole from '$lib/assets/tools/part-design/hole.svg';
	import groove from '$lib/assets/tools/part-design/groove.svg';
	import subtractiveLoft from '$lib/assets/tools/part-design/subtractive-loft.svg';
	import subtractivePipe from '$lib/assets/tools/part-design/subtractive-pipe.svg';
	import fillet from '$lib/assets/tools/part-design/fillet.svg';
	import chamfer from '$lib/assets/tools/part-design/chamfer.svg';
	import mirrored from '$lib/assets/tools/part-design/mirrored.svg';
	import linearPattern from '$lib/assets/tools/part-design/linear-pattern.svg';

	const documentType = $derived(project.selected?.type);
</script>

<div class="app">
	<header>
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
			<div class="std">
				<button class="icon"> <img src={coordinateSystem} alt="" /></button>
				<button class="icon"> <img src={group} alt="" /></button>
				<button class="icon"> <img src={linkMake} alt="" /></button>
			</div>
			<div class="workbench">
				<button class="icon"> <img src={body} alt="" /></button>
				<button class="icon"> <img src={newSketch} alt="" /></button>
				<button class="icon"> <img src={pad} alt="" /></button>
				<button class="icon"> <img src={revolution} alt="" /></button>
				<button class="icon"> <img src={additiveLoft} alt="" /></button>
				<button class="icon"> <img src={additivePipe} alt="" /></button>
				<button class="icon"> <img src={pocket} alt="" /></button>
				<button class="icon"> <img src={hole} alt="" /></button>
				<button class="icon"> <img src={groove} alt="" /></button>
				<button class="icon"> <img src={subtractiveLoft} alt="" /></button>
				<button class="icon"> <img src={subtractivePipe} alt="" /></button>
				<button class="icon"> <img src={fillet} alt="" /></button>
				<button class="icon"> <img src={chamfer} alt="" /></button>
				<button class="icon"> <img src={mirrored} alt="" /></button>
				<button class="icon"> <img src={linearPattern} alt="" /></button>
			</div>
		</div>
	</header>
	<main>
		<div class="pane">
			<PartList items={project.documents} />
			<Tree />
		</div>
		<Editor positionAnchor="--main-pane" active={true} />
		<div class="view">
			<!-- <h1>NEXT UP: ENTRIES AND FILTERS (PREV: FEATURES DRAG)</h1> -->
			<!-- <p>
				Make filters inheritnly in the entries method. Also make the entries method generic and just
				dependent on this.type
			</p> -->
			<span
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

		.pane {
			width: 24rem;

			display: flex;

			anchor-name: --main-pane;

			border-right: 2px solid var(--subtext-0);
		}

		.view {
			flex: 1;
		}
	}

	.toolbar {
		display: flex;
		gap: 1rem;
	}
	.toolbar .icon > img {
		height: 2rem;
	}
</style>
