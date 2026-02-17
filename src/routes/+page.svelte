<script lang="ts">
    import '../app.css'
    import { Home, Calendar, User, LogOut, Sun, Moon, Users, X, Clock, Mail, Phone, CheckCircle, LogIn, ArrowLeft, GraduationCap } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    import NavBar from '$lib/components/NavBar.svelte';
    import Header from '$lib/components/Header.svelte';
    import Legend from '$lib/components/Legend.svelte';
    import UserCard from '$lib/components/UserCard.svelte';

    import type { Session, LabRoom } from '$lib/shared/types';

    import { browser } from '$app/environment';
  import RoomButton from '$lib/components/RoomButton.svelte';

    export let data: { 
        session?: Session;
    };

    let labRooms: LabRoom[] = [];

    const fetchLabsRoom = async () => {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
            const response = await fetch(`${BACKEND_URL}/api/labs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success || !Array.isArray(data.data)) {
                console.error('Unexpected response format:', data);
                return;
            }

            labRooms = data.data

            console.log('Fetched labs room data:', labRooms);
        
        } catch (error) {
            console.error('Error fetching labs room data:', error);
        }
    }

    // ตรวจสอบ session จาก data ที่ส่งมาจาก server
    $: session = data.session;
    
    // Redirect to auth if no session
    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        fetchLabsRoom();
    });

    $: if (!session && browser) {
        window.location.href = '/auth';
    }
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each labRooms as labRoom}
                    <RoomButton {labRoom} />
                {/each}
            </div>
        </div>

    </div>
</div>

{/if}