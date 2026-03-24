<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { elasticIn } from 'svelte/easing';
	import { fly, slide, type FlyParams } from 'svelte/transition';
	import EditorTable from './EditorTable.svelte';

	interface Props {
		positionAnchor: string;
		active: boolean;
	}

	const { positionAnchor, active }: Props = $props();

	onMount(() => {
		if (positionAnchor.slice(0, 2) != '--') {
			throw Error(`positionAnchor: "${positionAnchor}" is not a valid CSS anchor name.`);
		}
	});

	let activeTab: 'task' | 'properties' = $state('properties');

	const flyParams = { x: 200, duration: 180 } satisfies FlyParams;
</script>

<div class="editor overlay" style:position-anchor={positionAnchor} hidden={!active}>
	<div class="tabs">
		<button class="tab" class:active-tab={activeTab === 'task'} onclick={() => (activeTab = 'task')}
			>Task</button
		>
		<button
			class="tab"
			class:active-tab={activeTab === 'properties'}
			onclick={() => (activeTab = 'properties')}>Properties</button
		>
	</div>

	<div class="top">
		<h1>Active Feature</h1>

		<button class="icon">
			<Trash />
		</button>
	</div>

	<div class="page">
		{#if activeTab === 'task'}
			<div class="task" transition:fly={{ ...flyParams, x: -flyParams.x }}>
				<fieldset>
					<div>
						<label for="mode">Mode</label>
						<select name="mode" id="mode">
							<option value="one-sided">One sided</option>
							<option value="two-sided">Two sided</option>
						</select>
					</div>

					<div>
						<label for="type">Type</label>
						<select name="type" id="type">
							<option value="dimension">Dimension</option>
							<option value="up-to">Up to next</option>
						</select>
					</div>

					<div>
						<label for="length">Length</label>
						<input type="number" name="length" id="length" />
					</div>

					<div>
						<label for="taper">Taper</label>
						<input type="number" name="taper" id="taper" />
					</div>

					<div>
						<div>
							<input type="checkbox" name="reversed" id="reversed" />
							<label for="reversed">Reversed</label>
						</div>
					</div>
				</fieldset>
			</div>
		{:else}
			<div class="properties" transition:fly={flyParams}>
				<EditorTable />
			</div>
		{/if}
	</div>
</div>

<style>
	.editor {
		width: 324px;
		min-height: 465px;
		max-height: 600px;

		position: absolute;

		inset-inline-start: calc(anchor(end) + 1.25em);
		inset-block-start: calc(anchor(start) + 1.25em);

		display: flex;
		flex-direction: column;
	}

	.page {
		flex: 1;
		display: grid;
		overflow-x: hidden;
		overflow-y: scroll;
		padding: 0 16px;
		padding-bottom: 128px;
	}
	.page div {
		grid-row: 1;
		grid-column: 1;
	}

	.task > fieldset > div {
		display: flex;
		justify-content: space-between;
	}

	.tabs {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		padding: 8px;
	}
	.tab {
		padding: 2px 8px;
		background-color: transparent;
		border-radius: 100px;
		color: inherit;

		border: none;
	}
	.active-tab {
		background-color: var(--subtext-0);
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0 24px;
	}
</style>
