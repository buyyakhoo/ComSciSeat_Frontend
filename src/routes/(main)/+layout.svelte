<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import NavBar from '$lib/components/web_layout/NavBar.svelte';
	import '../../app.css'

	let { children, data } = $props();
	let session = $derived(data?.session);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<title>ComSciSeat - ระบบจองโต๊ะคอมในห้องปฏิบัติการ</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<NavBar {session} />
{@render children?.()}
