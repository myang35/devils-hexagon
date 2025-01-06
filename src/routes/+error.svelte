<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="p-4 text-center text-3xl">
	<h1>{page.status}</h1>
	<h2>{page.error?.message}</h2>
</div>
