<script lang="ts">
	import type { GameDto } from '$lib/server/dtos';
	import { HexGrid } from '$lib/ui-hex-grid';
	import { Api } from '$lib/util-api';
	import { NamedTimeout, Timer } from '$lib/util-basic';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let { game }: { game: GameDto } = $props();

	let hexGrid: HexGrid;
	let clickedIndexes: number[] = [];
	let playerAnswering = $derived(Object.values(game.players).find((p) => p.isAnswering));
	let message = $state('');
	let timer = new Timer();
	let showTimer = $state(false);
	let showTarget = $state(false);
	let showCorrect = $state(false);
	let showWrong = $state(false);
	let wrongMessage = $state('');

	$effect(() => {
		if (game.status !== 'answering') return;

		if (playerAnswering) {
			message = `${playerAnswering.name} is answering...`;
			timer.stop();
		} else {
			message = 'Select 3 slots whose sum equals the target';
			timer.start();
		}
	});

	onMount(() => {
		watchGameChanges();

		return () => {
			NamedTimeout.clear('watchGameChanges');
			reset();
		};
	});

	async function watchGameChanges() {
		const updatedGame = (await Api.game.get(game.roomId).then((res) => res.json())) as GameDto;

		if (updatedGame.lastModified !== game.lastModified) {
			game = updatedGame;
		}

		NamedTimeout.set('watchGameChanges', () => watchGameChanges(), 1000);
	}

	function onSlotClick(index: number) {
		const slots = hexGrid.getSlots();
		const clickedSlot = slots[index];

		if (clickedSlot.isSelected()) {
			clickedIndexes.splice(clickedIndexes.indexOf(index), 1);
		} else {
			clickedIndexes.push(index);
			clickedIndexes.sort();
		}

		clickedSlot.select();

		if (clickedIndexes.length === 3) {
			let sum = 0;
			clickedIndexes.forEach((i) => {
				sum += slots[i].getValue();
			});

			if (sum === game.target) {
				const alreadyFound = game.foundSolutions.some((fs) =>
					fs.toSorted().every((index, i) => index === clickedIndexes[i])
				);
				if (alreadyFound) {
					wrongMessage = 'Already Found';
					showWrong = true;
				} else {
					game.foundSolutions.push(clickedIndexes);
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
					clickedIndexes = [];
					showCorrect = false;
					showWrong = false;
				},
				1000
			);
		}
	}

	async function onStartClick() {
		const slots = hexGrid.getSlots();
		showTarget = false;
		hexGrid.hideSlots();
		hexGrid.disableSlots();

		game.status = 'beginning';
		game.foundSolutions = [];
		game.target = Math.floor(Math.random() * 10) + 6; // 6 through 15
		game.gridValues = (() => {
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
			const valueList = valuesForTarget[game.target as keyof typeof valuesForTarget];
			slots.forEach((slot) => {
				const randomIndex = Math.floor(Math.random() * valueList.length);
				const randomValue = valueList.splice(randomIndex, 1)[0];
				slot.setValue(randomValue);
			});
			return slots.map((slot) => slot.getValue());
		})();

		game = await Api.game.update(game.roomId, game).then((res) => res.json());

		message = 'Ready';
		await wait(1);

		message = 'Set';
		await wait(1);

		game = await Api.game.update(game.roomId, { status: 'memorizing' }).then((res) => res.json());
		message = 'Memorize!';
		hexGrid.showSlots();
		showTimer = true;
		timer.start(3);
		await timer.wait();

		game = await Api.game.update(game.roomId, { status: 'answering' }).then((res) => res.json());
		message = 'Select 3 slots whose sum equals the target';
		showTarget = true;
		hexGrid.hideSlots();
		hexGrid.enableSlots();
		showTimer = true;
		timer.start(20);
		await timer.wait();

		game = await Api.game.update(game.roomId, { status: 'finished' }).then((res) => res.json());
		message = 'Game Over!';
		hexGrid.showSlots();
		hexGrid.disableSlots();
	}

	async function wait(seconds: number) {
		return new Promise<void>((resolve) => {
			NamedTimeout.set('wait', () => resolve(), seconds * 1000);
		});
	}

	async function reset() {
		for (const player of Object.values(game.players)) {
			player.isAnswering = false;
		}
		game.status = 'waiting';
		game = await Api.game.update(game.roomId, game).then((res) => res.json());
		showTarget = false;
		showTimer = false;
		timer.stop();
		timer.reset();
		message = '';
		hexGrid.hideSlots();
		hexGrid.disableSlots();
		NamedTimeout.clear('wait');
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Game ID: {game.roomId}</h1>

	{#if game.status === 'waiting' || game.status === 'finished'}
		<button class="w-min rounded border border-black/50 px-2 py-1" onclick={onStartClick}
			>Start</button
		>
	{:else}
		<button class="w-min rounded border border-black/50 px-2 py-1" onclick={reset}>Stop</button>
	{/if}

	<div class="flex w-full justify-center gap-8 border-t-2 border-black/40 p-4 shadow-black/20">
		{#each Object.entries(game.players) as [playerId, player]}
			<div class="flex flex-col items-center rounded px-4 py-1 shadow shadow-black/40">
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
			<span class="text-5xl">{game.target}</span>
		</div>
	{/if}

	{#if showTimer}
		<div class="flex flex-col text-center">
			<span class="text-3xl">Timer: {timer.seconds}</span>
			{#if playerAnswering}
				<span class="italic">(paused)</span>
			{/if}
		</div>
	{/if}
</div>
