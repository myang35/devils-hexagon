<script lang="ts">
	import { wait } from '$lib/util-basic';
	import HexSlot from './components/hex-slot.svelte';

	const { game }: { game: { id: string } } = $props();

	let slots: HexSlot[] = [];
	let clickedIndexes: number[] = [];
	let message = $state('');
	let timer = $state(0);
	let showTimer = $state(false);
	let target = $state(0);
	let showTarget = $state(false);

	function onSlotClick(index: number) {
		if (slots[index].isHighlighted()) {
			const removeIndex = clickedIndexes.findIndex((value) => value === index);
			clickedIndexes.splice(removeIndex, 1);
		} else {
			clickedIndexes.push(index);
		}

		slots[index].highlight();

		if (clickedIndexes.length === 3) {
			let sum = 0;
			clickedIndexes.forEach((i) => {
				sum += slots[i].getValue();
			});

			if (sum === target) {
				message = 'Correct!';
			} else {
				message = 'Wrong!';
			}
			setTimeout(() => {
				message = '...';
				clickedIndexes.forEach((i) => {
					slots[i].highlight();
				});
				clickedIndexes = [];
			}, 1000);
		}
	}

	async function onStartClick() {
		showTarget = false;
		slots.forEach((slot) => slot.hide());

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

		message = 'Ready';
		await wait(1000);

		message = 'Set';
		await wait(1000);

		message = 'Memorize!';
		slots.forEach((slot) => slot.show());
		await wait(1000);
		await startTimer(30);

		message = '...';
		showTarget = true;
		slots.forEach((slot) => slot.hide());
		await startTimer(90);

		message = 'Game Over!';
		slots.forEach((slot) => slot.show());
	}

	async function startTimer(seconds: number) {
		showTimer = true;
		timer = seconds;

		return new Promise<void>((resolve) => {
			const intervalId = setInterval(() => {
				if (timer <= 0) {
					showTimer = false;
					clearInterval(intervalId);
					resolve();
				}
				timer--;
			}, 1000);
		});
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Game ID: {game.id}</h1>

	<button class="w-min rounded border border-black/50 px-2 py-1" onclick={onStartClick}
		>Start</button
	>

	<div class="flex flex-col items-center">
		<div class="flex gap-4">
			<HexSlot bind:this={slots[0]} onclick={() => onSlotClick(0)}>A</HexSlot>
			<HexSlot bind:this={slots[1]} onclick={() => onSlotClick(1)}>B</HexSlot>
			<HexSlot bind:this={slots[2]} onclick={() => onSlotClick(2)}>C</HexSlot>
		</div>
		<div class="flex gap-4">
			<HexSlot bind:this={slots[3]} onclick={() => onSlotClick(3)}>D</HexSlot>
			<HexSlot bind:this={slots[4]} onclick={() => onSlotClick(4)}>E</HexSlot>
			<HexSlot bind:this={slots[5]} onclick={() => onSlotClick(5)}>F</HexSlot>
			<HexSlot bind:this={slots[6]} onclick={() => onSlotClick(6)}>G</HexSlot>
		</div>
		<div class="flex gap-4">
			<HexSlot bind:this={slots[7]} onclick={() => onSlotClick(7)}>H</HexSlot>
			<HexSlot bind:this={slots[8]} onclick={() => onSlotClick(8)}>I</HexSlot>
			<HexSlot bind:this={slots[9]} onclick={() => onSlotClick(9)}>J</HexSlot>
			<HexSlot bind:this={slots[10]} onclick={() => onSlotClick(10)}>K</HexSlot>
			<HexSlot bind:this={slots[11]} onclick={() => onSlotClick(11)}>L</HexSlot>
		</div>
		<div class="flex gap-4">
			<HexSlot bind:this={slots[12]} onclick={() => onSlotClick(12)}>M</HexSlot>
			<HexSlot bind:this={slots[13]} onclick={() => onSlotClick(13)}>N</HexSlot>
			<HexSlot bind:this={slots[14]} onclick={() => onSlotClick(14)}>O</HexSlot>
			<HexSlot bind:this={slots[15]} onclick={() => onSlotClick(15)}>P</HexSlot>
		</div>
		<div class="flex gap-4">
			<HexSlot bind:this={slots[16]} onclick={() => onSlotClick(16)}>Q</HexSlot>
			<HexSlot bind:this={slots[17]} onclick={() => onSlotClick(17)}>R</HexSlot>
			<HexSlot bind:this={slots[18]} onclick={() => onSlotClick(18)}>S</HexSlot>
		</div>
	</div>

	<span class="text-5xl">{message}</span>

	{#if showTarget}
		<span class="text-5xl">Target: {target}</span>
	{/if}

	{#if showTimer}
		<span class="text-3xl">Timer: {timer}</span>
	{/if}
</div>
