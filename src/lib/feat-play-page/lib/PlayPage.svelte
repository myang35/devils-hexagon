<script lang="ts">
	import type { GameDto } from '$lib/server/dtos';
	import { HexGrid } from '$lib/ui-hex-grid';
	import { Api } from '$lib/util-api';
	import { NamedInterval, NamedTimeout } from '$lib/util-basic';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let { game }: { game: GameDto } = $props();

	let hexGrid: HexGrid;
	let clickedIndexes = new Set<number>();
	let foundSolutions: Set<number>[] = [];
	let isPlaying = $state(false);
	let message = $state('');
	let timer = $state(0);
	let showTimer = $state(false);
	let target = $state(0);
	let showTarget = $state(false);
	let showCorrect = $state(false);
	let showWrong = $state(false);
	let wrongMessage = $state('');

	onMount(() => {
		watchGameChanges();
	});

	onDestroy(() => {
		NamedTimeout.clear('watchGameChanges');
	});

	async function watchGameChanges() {
		const updatedGame = await Api.game.get(game.id);

		if (updatedGame.lastModified !== game.lastModified) {
			game = updatedGame;
		}

		NamedTimeout.set('watchGameChanges', () => watchGameChanges(), 1000);
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

	async function onStartClick() {
		const slots = hexGrid.getSlots();
		isPlaying = true;
		showTarget = false;
		hexGrid.hideSlots();
		hexGrid.disableSlots();
		foundSolutions = [];

		const valuesForTarget = {
			6: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4],
			7: [1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5],
			8: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6],
			9: [1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6],
			10: [2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5],
			11: [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6],
			12: [2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6],
			13: [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6],
			14: [3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7],
			15: [3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7]
		};
		target = Math.floor(Math.random() * 10) + 6; // 6 through 15

		const valueList = valuesForTarget[target as keyof typeof valuesForTarget];

		slots.forEach((slot) => {
			const randomIndex = Math.floor(Math.random() * valueList.length);
			const randomValue = valueList.splice(randomIndex, 1)[0];
			slot.setValue(randomValue);
		});

		await Api.game.update(game.id, {
			status: 'beginning',
			gridValues: slots.map((slot) => slot.getValue()),
			foundSolutions: [],
			target
		});

		message = 'Ready';
		await wait(1);

		message = 'Set';
		await wait(1);

		await Api.game.update(game.id, { status: 'memorizing' });
		message = 'Memorize!';
		hexGrid.showSlots();
		await wait(1);
		await startTimer(3);

		await Api.game.update(game.id, { status: 'answering' });
		message = 'Select 3 slots whose sum equals the target';
		showTarget = true;
		hexGrid.hideSlots();
		hexGrid.enableSlots();
		await wait(3);
		await startTimer(20);

		await Api.game.update(game.id, { status: 'finished' });
		message = 'Game Over!';
		hexGrid.showSlots();
		hexGrid.disableSlots();
		isPlaying = false;
	}

	async function wait(seconds: number) {
		return new Promise<void>((resolve) => {
			NamedTimeout.set('wait', () => resolve(), seconds * 1000);
		});
	}

	async function startTimer(seconds: number) {
		showTimer = true;
		timer = seconds;

		return new Promise<void>((resolve) => {
			NamedInterval.set(
				'timer',
				() => {
					if (timer <= 0) {
						showTimer = false;
						NamedInterval.clear('timer');
						resolve();
					}
					timer--;
				},
				1000
			);
		});
	}

	async function reset() {
		await Api.game.update(game.id, { status: 'waiting' });
		isPlaying = false;
		showTarget = false;
		showTimer = false;
		message = '';
		hexGrid.hideSlots();
		hexGrid.disableSlots();
		NamedTimeout.clear('wait');
		NamedInterval.clear('timer');
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Game ID: {game.id}</h1>

	{#if isPlaying}
		<button class="w-min rounded border border-black/50 px-2 py-1" onclick={reset}>Stop</button>
	{:else}
		<button class="w-min rounded border border-black/50 px-2 py-1" onclick={onStartClick}
			>Start</button
		>
	{/if}

	<div class="flex w-full justify-center gap-8 border-y-2 border-black/40 px-4 py-1">
		{#each Object.entries(game.players) as [playerId, player]}
			<div class="flex flex-col items-center">
				<span class="text-lg">{player.name ? player.name : playerId}</span>
				<span>Score: {player.points}</span>
			</div>
		{/each}
	</div>

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

	<span class="text-center text-3xl">{message}</span>

	{#if showTarget}
		<div class="flex flex-col items-center rounded border border-black px-4 py-2">
			<span class="text-xl">Target:</span>
			<span class="text-5xl">{target}</span>
		</div>
	{/if}

	{#if showTimer}
		<span class="text-3xl">Timer: {timer}</span>
	{/if}
</div>
