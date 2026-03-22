<script lang="ts">
	const { names }: { names: string[] } = $props();
</script>

<ul class="workbench-tabs">
	{#each names as name, index}
		{@const id = 'tab-' + index}
		<li>
			<input type="radio" name="workbench-tab" {id} checked={index === 0} />
			<label for={id}>{name}</label>
		</li>
	{/each}
</ul>

<style>
	.workbench-tabs {
		background-color: var(--crust);
		padding: 0.35rem 0.5rem;
		border-radius: 2rem;
		border: solid 1px var(--overlay-0);

		display: flex;
		gap: 0.5rem;

		list-style-type: none;
		margin: 0;

		transition-property: width;
		transition-duration: 3s;
	}

	.workbench-tabs label,
	.workbench-tabs input {
		text-align: center;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0.4rem 0.5rem;
		border-radius: 2rem;
		cursor: pointer;
	}

	.workbench-tabs input[type='radio'] {
		display: none;
	}

	.workbench-tabs label:hover {
		background-color: var(--surface-0);
	}
	.workbench-tabs input[type='radio']:checked + label {
		color: var(--crust);
		background-color: var(--blue);
	}
</style>
