<script lang="ts">
    import '../app.css'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import NavBar from '$lib/components/initial/NavBar.svelte';
    import Header from '$lib/components/main/Header.svelte';
    import UserCard from '$lib/components/main/UserCard.svelte';
    import type { Session, LabRoom } from '$lib/shared/types';
    import { browser } from '$app/environment';
    import RoomButton from '$lib/components/card/RoomButton.svelte';

    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_API_URL;
    let { data }: { data?: { session?: Session } } = $props();
    let labRooms: LabRoom[] = $state([]);

    const fetchLabsRoom = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/labs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.success || !Array.isArray(responseData.data)) {
                console.error('Unexpected response format:', responseData);
                return;
            }
            
            labRooms = responseData.data
        } catch (error) {
            console.error('Error fetching labs room data:', error);
        }
    }

    const session = $derived(data?.session);
    
    // Redirect to auth if no session
    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        fetchLabsRoom();
    });

    $effect(() => {
        if (!session && browser) {
            window.location.href = '/auth';
        }
    });
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

<!-- Content -->
<div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-7xl">    
        <!-- Header -->
        <Header />

        <!-- User Info Card -->
        <UserCard {session} />
        
        <!-- Tables -->
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