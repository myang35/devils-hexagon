<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		children,
		onclick
	}: {
		children: Snippet;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	let value = $state(0);
	let highlighted = $state(false);
	let hidden = $state(true);

	export function setValue(newValue: number) {
		value = newValue;
	}

	export function getValue() {
		return value;
	}

	export function highlight() {
		highlighted = !highlighted;
	}

	export function isHighlighted() {
		return highlighted;
	}

	export function show() {
		hidden = false;
	}

	export function hide() {
		hidden = true;
	}
</script>

<button
	{onclick}
	class={{
		'flex h-20 w-20 items-center justify-center rounded-full border border-black text-5xl': true,
		'bg-red-500/50': highlighted,
		'hover:bg-red-500/10': !highlighted
	}}
>
	{#if hidden}
		{@render children()}
	{:else}
		{value}
	{/if}
</button>
