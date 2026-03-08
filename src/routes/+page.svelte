<script lang="ts">
    import '../app.css'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import NavBar from '$lib/components/web_layout/NavBar.svelte';
    import Header from '$lib/components/decorate/Header.svelte';
    import UserCard from '$lib/components/card/UserCard.svelte';
    import type { Session, LabRoom } from '$lib/shared/types';
    import RoomButton from '$lib/components/card/RoomButton.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let session = $derived(data.session);
    let labRooms: LabRoom[] = $derived(data.labRooms);
</script>

<svelte:head>
    <title>หน้าแรก - ComSciSeat</title>
</svelte:head>

<!-- Session Expired Alert -->
{#if !session}
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="text-center">
            <div class="loading loading-spinner loading-lg mb-4"></div>
            <p>กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
        </div>
    </div>
{:else}
    <NavBar {session} />
    <div class="min-h-screen bg-base-200">
        <div class="container mx-auto px-4 py-8 max-w-7xl">    
            <Header />
            <UserCard {session} />
            <div class="mb-8">
                <h3 class="text-xl font-bold mb-4">ห้องแลปคอม</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
                    {#each labRooms as labRoom}
                        <RoomButton 
                            allowed={true}
                            code={labRoom.lab_id.toString()}
                            describe={labRoom.lab_name}
                            onButton={() => {
                                goto(`/lab_tables/${labRoom.lab_id}`);
                            }}  
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}