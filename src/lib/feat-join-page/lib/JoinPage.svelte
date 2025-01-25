<script lang="ts">
	import type { GameDto, PlayerDto } from '$lib/server/dtos';
	import { HexGrid } from '$lib/ui-hex-grid';
	import { Api } from '$lib/util-api';
	import { NamedTimeout, Timer, wait } from '$lib/util-basic';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let { game, player }: { game: GameDto; player: PlayerDto } = $props();

	let hexGrid = $state<HexGrid>();
	let clickedIndexes: number[] = [];
	let otherPlayerAnswering = $derived(
		Object.entries(game.players).some(([id, p]) => p.isAnswering && id !== player.id)
	);
	let showCorrect = $state(false);
	let showWrong = $state(false);
	let wrongMessage = $state('');
	let joinErrorMessage = $state('');
	let renameErrorMessage = $state('');
	let showTimer = $state(false);
	let isRenaming = $state(false);
	let timer = new Timer();

	onMount(async () => {
		watchGameChanges();
	});

	onDestroy(() => {
		NamedTimeout.clear('watchGameChanges');
		timer.stop();
	});

	async function watchGameChanges() {
		const updatedGame = (await Api.game.get(game.roomId).then((res) => res.json())) as GameDto;
		if (updatedGame.lastModified !== game.lastModified) {
			game = updatedGame;
		}

		NamedTimeout.set('watchGameChanges', () => watchGameChanges(), 1000);
	}

	async function onJoinSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name')?.toString();

		if (!name) {
			joinErrorMessage = 'Name is required';
			return;
		}

		game = await Api.game.addPlayer(game.roomId, { id: player.id, name }).then((res) => res.json());
	}

	async function onAnswerClick() {
		game.players[player.id].isAnswering = true;
		game = await Api.game.update(game.roomId, game).then((res) => res.json());

		// wait for DOM to update
		for (let i = 0; i < 10; i++) {
			await wait(i * 100);
			if (hexGrid) break;
		}
		if (!hexGrid) {
			game.players[player.id].isAnswering = true;
			game = await Api.game.update(game.roomId, game).then((res) => res.json());
			return;
		}

		hexGrid.enableSlots();
		hexGrid.getSlots().forEach((slot, i) => slot.setValue(game.gridValues[i]));
		timer.start(15);
		showTimer = true;
		await timer.wait();

		if (game.players[player.id].isAnswering) {
			game.players[player.id].isAnswering = false;
			game.players[player.id].points -= 1;
			game = await Api.game.update(game.roomId, game).then((res) => res.json());
		}
	}

	async function onSlotClick(index: number) {
		if (!hexGrid) return;

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
				const alreadyFound = game.foundSolutions.some((foundSolution) =>
					foundSolution.toSorted().every((index, i) => index === clickedIndexes[i])
				);
				if (alreadyFound) {
					game.players[player.id].points -= 1;
					game = await Api.game.update(game.roomId, game).then((res) => res.json());
					wrongMessage = 'Already Found';
					showWrong = true;
				} else {
					game.foundSolutions.push(clickedIndexes);
					game.players[player.id].points += 1;
					game = await Api.game.update(game.roomId, game).then((res) => res.json());
					showCorrect = true;
				}
			} else {
				game.players[player.id].points -= 1;
				game = await Api.game.update(game.roomId, game).then((res) => res.json());
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
					game.players[player.id].isAnswering = false;
					Api.game
						.update(game.roomId, game)
						.then((res) => res.json() as Promise<GameDto>)
						.then((updatedGame) => (game = updatedGame));
				},
				1000
			);
		}
	}

	async function onRenameSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name')?.toString();

		if (!name) {
			renameErrorMessage = 'Name is required';
			return;
		}

		game.players[player.id].name = name;
		game = await Api.game.update(game.roomId, game).then((res) => res.json());

		isRenaming = false;
	}
</script>

<div class="flex flex-col items-center gap-4">
	<span class="text-center">Game ID: {game.roomId}</span>

	{#if game.status === 'waiting' || game.status === 'finished'}
		{#if !game.players[player.id]}
			<form onsubmit={onJoinSubmit} class="flex flex-col items-center gap-4">
				<div class="flex flex-col items-center">
					<input
						name="name"
						type="text"
						placeholder="Enter Name"
						maxlength="16"
						class="rounded-lg border border-black px-2 py-1 text-center text-2xl"
					/>
					{#if joinErrorMessage}
						<span
							class="w-full rounded border border-red-900/60 bg-red-200/60 px-2 py-1 text-center text-sm text-red-900"
						>
							{joinErrorMessage}
						</span>
					{/if}
				</div>
				<button
					type="submit"
					class="rounded-full border-4 border-red-800/80 bg-red-500/80 px-4 py-2 text-2xl font-bold tracking-wide text-white"
					>Join Game</button
				>
			</form>
		{:else}
			<span class="text-center text-3xl">Waiting for game to start...</span>
			{#if isRenaming}
				<form onsubmit={onRenameSubmit} class="flex flex-col items-center gap-4">
					<div class="flex flex-col items-center">
						<input
							name="name"
							type="text"
							placeholder="Enter Name"
							maxlength="16"
							class="rounded-lg border border-black px-2 py-1 text-center text-2xl"
						/>
						{#if renameErrorMessage}
							<span
								class="w-full rounded border border-red-900/60 bg-red-200/60 px-2 py-1 text-center text-sm text-red-900"
								>{renameErrorMessage}</span
							>
						{/if}
					</div>
					<div class="flex gap-8">
						<button
							type="button"
							class="rounded-full border border-black/50 px-4 py-2 text-lg font-bold tracking-wide text-black/80"
							onclick={() => {
								isRenaming = false;
								renameErrorMessage = '';
							}}>Cancel</button
						>
						<button
							type="submit"
							class="rounded-full border-4 border-red-800/80 bg-red-500/80 px-4 py-2 text-lg font-bold tracking-wide text-white"
							>Submit</button
						>
					</div>
				</form>
			{:else}
				<button onclick={() => (isRenaming = true)} class="rounded border border-black px-2 py-1"
					>Rename?</button
				>
			{/if}
		{/if}
	{:else if game.status === 'beginning'}
		<span class="text-center text-3xl">Game is beginning...</span>
	{:else if game.status === 'memorizing'}
		<span class="text-center text-3xl">Memorize!</span>
	{:else if game.status === 'answering'}
		{#if game.players[player.id].isAnswering}
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

			{#if showTimer}
				<span class="text-3xl">Timer: {timer.seconds}</span>
			{/if}
		{:else if otherPlayerAnswering}
			<span class="text-center text-3xl">Waiting for other player to answer...</span>
		{:else}
			<button
				class="h-40 w-full max-w-96 rounded-full border-8 border-red-800/80 bg-gradient-to-tr from-red-500/80 to-red-500/60 text-5xl font-bold tracking-wide text-white"
				onclick={onAnswerClick}>Answer</button
			>
		{/if}
	{:else if game.status === 'finished'}{/if}
</div>
