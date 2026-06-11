<script lang="ts">
	import { ListFilter } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		topLeft: Snippet;
		content: Snippet<[string]>;
		bottom: Snippet;
		filters: { id: string; name: string }[];
	}

	const { topLeft, content, filters }: Props = $props();

	let filterValue = $state() as string;

	const onfilterchange: FormEventHandler<HTMLFormElement> = (event) => {
		const filter = (event.target as HTMLInputElement)?.value as string;
		filterValue = filter;
	};
</script>

<div class="tree">
	<div class="top">
		{@render topLeft()}

		<button class="icon" id="filter-anchor" popovertarget="filter-popover">
			<ListFilter size={20} />
		</button>
		<div class="filter-popup overlay" id="filter-popover" popover="auto">
			<p style="width: 16rem; padding: 1rem; text-wrap: pretty;">
				Sigh. I managed to break the filter during refactoring. It will be fixed... later.
			</p>
			<!-- <form action="#" onchange={onfilterchange}>
				<fieldset>
					<legend>Show</legend>

					{#each filters as filter, index}
						<li>
							<input
								type="radio"
								id={filter.id}
								name="filter"
								value={filter.id}
								checked={index === 0}
							/>
							<label for={filter.id}>{filter.name}</label>
						</li>
					{/each}
				</fieldset>
			</form> -->
		</div>
	</div>

	<div class="content">
		{@render content(filterValue)}
	</div>
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

	.content {
		flex: 1;
		overflow-y: scroll;
	}
</style>
