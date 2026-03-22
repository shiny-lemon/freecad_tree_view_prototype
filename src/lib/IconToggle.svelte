<script lang="ts">
	import type { Component } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props {
		Unchecked: Component;
		Checked: Component;
		checked?: boolean;
		onchange?: ChangeEventHandler<HTMLInputElement>;
	}

	let { Unchecked, Checked, checked = $bindable(false), onchange }: Props = $props();
</script>

<label>
	<input type="checkbox" name="toggle" bind:checked {onchange} />
	<div class="icon">
		{#if checked}
			<Checked />
		{:else}
			<Unchecked />
		{/if}
	</div>
</label>

<style>
	input[type='checkbox'] {
		display: none;
	}
</style>
