<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import NavBar from '$lib/components/web_layout/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<title>ComSciSeat - ระบบจองโต๊ะคอมในห้องปฏิบัติการ</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{@render children?.()}
