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
		display: flex;
		gap: 0.5rem;

		list-style-type: none;
		padding: 0;
	}

	.workbench-tabs label,
	.workbench-tabs input {
		text-align: center;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0.4rem 0.5rem;
		cursor: pointer;

		text-decoration-skip-ink: none;
	}

	.workbench-tabs input[type='radio'] {
		display: none;
	}

	.workbench-tabs label:hover {
		text-decoration: underline var(--text);
	}
	.workbench-tabs input[type='radio']:checked + label {
		text-decoration: 0.175rem underline var(--contrast);
	}
</style>
