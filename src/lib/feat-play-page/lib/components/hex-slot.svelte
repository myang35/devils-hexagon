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
	let selected = $state(false);
	let hidden = $state(true);
	let disabled = $state(true);

	export function setValue(newValue: number) {
		value = newValue;
	}

	export function getValue() {
		return value;
	}

	export function select() {
		selected = !selected;
	}

	export function isSelected() {
		return selected;
	}

	export function show() {
		hidden = false;
	}

	export function hide() {
		hidden = true;
	}

	export function enable() {
		disabled = false;
	}

	export function disable() {
		disabled = true;
	}
</script>

<button
	{onclick}
	{disabled}
	class={{
		'flex h-20 w-20 items-center justify-center rounded-full border border-black text-5xl': true,
		'bg-red-500/50': selected,
		'hover:bg-red-500/10': !selected && !disabled
	}}
>
	{#if hidden}
		{@render children()}
	{:else}
		{value}
	{/if}
</button>
