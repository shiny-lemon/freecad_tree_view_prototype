<script lang="ts">
	import type { IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	interface IconToggleProps {
		Unchecked: Component;
		Checked: Component;
		checked?: boolean;
	}

	type Props = IconToggleProps & IconProps;

	let {
		Unchecked,
		Checked,
		checked = $bindable(false),
		onchange,
		...componentProps
	}: Props = $props();
</script>

<label>
	<input type="checkbox" name="toggle" bind:checked />
	<div class="icon">
		{#if checked}
			<Checked {...componentProps} />
		{:else}
			<Unchecked {...componentProps} />
		{/if}
	</div>
</label>

<style>
	input[type='checkbox'] {
		display: none;
	}
</style>
