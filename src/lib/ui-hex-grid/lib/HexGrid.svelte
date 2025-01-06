<script lang="ts">
	import HexSlot from './hex-slot/HexSlot.svelte';

	const { onSlotClick }: { onSlotClick?: (index: number) => void } = $props();

	let slots: HexSlot[] = [];

	export function getSlots() {
		return slots;
	}

	export function hideSlots() {
		slots.forEach((slot) => slot.hide());
	}

	export function showSlots() {
		slots.forEach((slot) => slot.show());
	}

	export function enableSlots() {
		slots.forEach((slot) => slot.enable());
	}

	export function disableSlots() {
		slots.forEach((slot) => slot.disable());
	}
</script>

<div class="flex flex-col items-center">
	<div class="flex gap-4">
		<HexSlot bind:this={slots[0]} onclick={onSlotClick ? () => onSlotClick(0) : undefined}
			>A</HexSlot
		>
		<HexSlot bind:this={slots[1]} onclick={onSlotClick ? () => onSlotClick(1) : undefined}
			>B</HexSlot
		>
		<HexSlot bind:this={slots[2]} onclick={onSlotClick ? () => onSlotClick(2) : undefined}
			>C</HexSlot
		>
	</div>
	<div class="flex gap-4">
		<HexSlot bind:this={slots[3]} onclick={onSlotClick ? () => onSlotClick(3) : undefined}
			>D</HexSlot
		>
		<HexSlot bind:this={slots[4]} onclick={onSlotClick ? () => onSlotClick(4) : undefined}
			>E</HexSlot
		>
		<HexSlot bind:this={slots[5]} onclick={onSlotClick ? () => onSlotClick(5) : undefined}
			>F</HexSlot
		>
		<HexSlot bind:this={slots[6]} onclick={onSlotClick ? () => onSlotClick(6) : undefined}
			>G</HexSlot
		>
	</div>
	<div class="flex gap-4">
		<HexSlot bind:this={slots[7]} onclick={onSlotClick ? () => onSlotClick(7) : undefined}
			>H</HexSlot
		>
		<HexSlot bind:this={slots[8]} onclick={onSlotClick ? () => onSlotClick(8) : undefined}
			>I</HexSlot
		>
		<HexSlot bind:this={slots[9]} onclick={onSlotClick ? () => onSlotClick(9) : undefined}
			>J</HexSlot
		>
		<HexSlot bind:this={slots[10]} onclick={onSlotClick ? () => onSlotClick(10) : undefined}
			>K</HexSlot
		>
		<HexSlot bind:this={slots[11]} onclick={onSlotClick ? () => onSlotClick(11) : undefined}
			>L</HexSlot
		>
	</div>
	<div class="flex gap-4">
		<HexSlot bind:this={slots[12]} onclick={onSlotClick ? () => onSlotClick(12) : undefined}
			>M</HexSlot
		>
		<HexSlot bind:this={slots[13]} onclick={onSlotClick ? () => onSlotClick(13) : undefined}
			>N</HexSlot
		>
		<HexSlot bind:this={slots[14]} onclick={onSlotClick ? () => onSlotClick(14) : undefined}
			>O</HexSlot
		>
		<HexSlot bind:this={slots[15]} onclick={onSlotClick ? () => onSlotClick(15) : undefined}
			>P</HexSlot
		>
	</div>
	<div class="flex gap-4">
		<HexSlot bind:this={slots[16]} onclick={onSlotClick ? () => onSlotClick(16) : undefined}
			>Q</HexSlot
		>
		<HexSlot bind:this={slots[17]} onclick={onSlotClick ? () => onSlotClick(17) : undefined}
			>R</HexSlot
		>
		<HexSlot bind:this={slots[18]} onclick={onSlotClick ? () => onSlotClick(18) : undefined}
			>S</HexSlot
		>
	</div>
</div>
