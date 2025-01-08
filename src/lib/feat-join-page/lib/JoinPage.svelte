<script lang="ts">
	import type { GameDto } from '$lib/server/dtos';
	import { HexGrid } from '$lib/ui-hex-grid';
	import { api } from '$lib/util-api';
	import { NamedTimeout } from '$lib/util-basic';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let { game }: { game: GameDto } = $props();

	let hexGrid: HexGrid;
	let clickedIndexes = new Set<number>();
	let foundSolutions: Set<number>[] = [];
	let target = $state(0);
	let isAnswering = $state(false);
	let showCorrect = $state(false);
	let showWrong = $state(false);
	let wrongMessage = $state('');

	onMount(() => {
		watchGameChanges();
	});

	async function watchGameChanges() {
		const updatedGame = await api.game.get(game.id);

		if (updatedGame.lastModified !== game.lastModified) {
			game = updatedGame;
		}

		setTimeout(() => watchGameChanges(), 1000);
	}

	function onAnswerClick() {
		isAnswering = true;
		setTimeout(() => hexGrid.enableSlots());
	}

	function onSlotClick(index: number) {
		const slots = hexGrid.getSlots();
		const clickedSlot = slots[index];

		if (clickedSlot.isSelected()) {
			clickedIndexes.delete(index);
		} else {
			clickedIndexes.add(index);
		}

		clickedSlot.select();

		if (clickedIndexes.size === 3) {
			let sum = 0;
			clickedIndexes.forEach((i) => {
				sum += slots[i].getValue();
			});

			if (sum === target) {
				const alreadyFound = foundSolutions.some((foundSolution) =>
					foundSolution.isSubsetOf(clickedIndexes)
				);
				if (alreadyFound) {
					wrongMessage = 'Already Found';
					showWrong = true;
				} else {
					foundSolutions.push(new Set(clickedIndexes));
					showCorrect = true;
				}
			} else {
				wrongMessage = '';
				showWrong = true;
			}

			NamedTimeout.set(
				'clearSelectedSlots',
				() => {
					clickedIndexes.forEach((i) => {
						slots[i].select();
					});
					clickedIndexes.clear();
					showCorrect = false;
					showWrong = false;
				},
				1000
			);
		}
	}
</script>

<div class="flex flex-col items-center gap-4">
	<span class="text-center">Game ID: {game.id}</span>

	{#if game.status === 'waiting'}
		<span class="text-center text-3xl">Waiting for game to start...</span>
	{:else if game.status === 'beginning'}
		<span class="text-center text-3xl">Game is beginning...</span>
	{:else if game.status === 'memorizing'}
		<span class="text-center text-3xl">Memorize!</span>
	{:else if game.status === 'answering'}
		{#if isAnswering}
			<div class="relative flex flex-col items-center">
				{#if showCorrect}
					<Fa icon={faCheck} class="absolute inset-0 m-auto text-[20rem] text-green-500/80" />
				{/if}
				{#if showWrong}
					<Fa icon={faX} class="absolute inset-0 m-auto text-[20rem] text-red-500/80" />
					{#if wrongMessage}
						<span
							class="absolute inset-0 m-auto h-fit w-fit rounded border border-red-700 bg-red-100/90 px-2 py-1 text-5xl text-red-700"
							>{wrongMessage}</span
						>
					{/if}
				{/if}

				<HexGrid bind:this={hexGrid} {onSlotClick} />
			</div>
		{:else}
			<button
				class="h-96 w-full rounded-full border-8 border-red-800/80 bg-gradient-to-tr from-red-500/80 to-red-500/60 text-5xl font-bold tracking-wide text-white"
				onclick={onAnswerClick}>Answer</button
			>
		{/if}
	{:else if game.status === 'finished'}
		<span class="text-center text-3xl">Game is finished</span>
	{/if}
</div>
