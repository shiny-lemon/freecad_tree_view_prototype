<script lang="ts">
	import { selectDocument, getDocuments } from '$lib/data/data.svelte';
	import type { Document } from '$lib/project/document';

	interface Props {
		documents: Document[];
	}

	const { documents }: Props = $props();
</script>

<ul>
	{#each documents as document}
		<li>
			<a href="/" class="wrapper" onclick={() => selectDocument(document.id)}>
				<div class="content">
					{#await import(`$lib/assets/thumbnails/${document.thumbnail}.png`)}
						<div class="document-image"></div>
					{:then { default: src }}
						<enhanced:img class="document-image" {src} alt="" />
					{/await}
				</div>
				<div class="text">
					<span class="name">{document.name}</span>
					<span class="date">3rd June 2026</span>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.wrapper {
		display: flex;
		gap: 0.5rem;
		text-decoration: none;
	}

	.document-image {
		width: 48px;
		border-radius: 4px;
		background-color: grey;
	}

	.text {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.name {
		font-weight: bold;
		font-size: 1.25rem;
		text-overflow: ellipsis;
	}
</style>
