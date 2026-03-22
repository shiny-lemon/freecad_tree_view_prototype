<script lang="ts">
	import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';

	let { children } = $props();

	let contenteditable = $state(false);

	let div: HTMLDivElement | null = $state(null);
	const startEdit = () => {
		const updatedContenteditable = !Boolean(contenteditable);
		contenteditable = true;
		// TODO For focusing with keyboard!
		if (updatedContenteditable && div !== null) {
			const range = document.createRange();
			const selection = window.getSelection();
			range.selectNodeContents(div.childNodes[0]);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	};

	const ondblclick: MouseEventHandler<HTMLElement> = () => {
		contenteditable = true;
	};

	const onblur: FocusEventHandler<HTMLElement> = () => {
		contenteditable = false;
	};
</script>

<div
	ondblclick={() => startEdit()}
	{onblur}
	tabindex="0"
	role="textbox"
	bind:this={div}
	{contenteditable}
	class={{ contenteditable }}
>
	{@render children()}
</div>

<style>
	div {
		flex: 1;
		height: 100%;
		width: 100%;
	}

	div:focus.contenteditable {
		outline: var(--contrast) 2px solid;
	}
</style>
