<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { fly, type FlyParams } from 'svelte/transition';
	import EditorTable from './EditorTable.svelte';
	import type { FormEventHandler } from 'svelte/elements';

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

	const editorTabs = {
		TASK: 'task-tab',
		PROPERTIES: 'properties-tab'
	} as const;
	type EditorTab = (typeof editorTabs)[keyof typeof editorTabs];

	let activeTab: EditorTab = $state(editorTabs.PROPERTIES);
	const oninput: FormEventHandler<HTMLElement> = (event) => {
		console.log(event);
		activeTab = (event.target as HTMLElement)?.id as EditorTab;
	};
	$inspect(activeTab);

	const flyParams = { x: 200, duration: 180 } satisfies FlyParams;
</script>

<div class="editor overlay" style:position-anchor={positionAnchor} hidden={!active}>
	<ul class="editor-tabs" {oninput}>
		<li>
			<label>
				<input
					type="radio"
					name="editor-tab"
					id={editorTabs.TASK}
					checked={activeTab === editorTabs.TASK}
				/>
				Task
			</label>
		</li>
		<li>
			<label>
				<input
					type="radio"
					name="editor-tab"
					id={editorTabs.PROPERTIES}
					checked={activeTab === editorTabs.PROPERTIES}
				/>
				Properties
			</label>
		</li>

		<!-- <button class="tab" class:active-tab={activeTab === 'task'} onclick={() => (activeTab = 'task')}
			>Task</button
		>
		<button
			class="tab"
			class:active-tab={activeTab === 'properties'}
			onclick={() => (activeTab = 'properties')}>Properties</button
		> -->
	</ul>

	<div class="top">
		<h1>Active Feature</h1>

		<button class="icon">
			<Trash />
		</button>
	</div>

	<div class="page">
		{#if activeTab === editorTabs.TASK}
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
		{:else if activeTab === editorTabs.PROPERTIES}
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

	.editor-tabs {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		list-style-type: none;
	}
	.editor-tabs label,
	.editor-tabs input {
		text-align: center;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0.4rem 0.5rem;
		cursor: pointer;

		text-decoration-skip-ink: none;
	}

	.editor-tabs input[type='radio'] {
		display: none;
	}

	.editor-tabs label:hover {
		text-decoration: underline var(--text);
	}
	.editor-tabs label:has(> input[type='radio']:checked) {
		background-color: var(--subtext-0);
		border-radius: 100px;
		padding: 2px 8px;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0 24px;
	}
</style>
