<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
	<title>QuickSciSeat - ระบบจองโต๊ะอาหาร</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{@render children?.()}
