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

    import type { Session } from '$lib/shared/types';

    import { browser } from '$app/environment';

    export let data: { 
        session?: Session;
    };
    
    // Modal states
    let showReservationModal = false;
    let showDetailModal = false;
    let showStudentIdModal = false;
    
    // Form data
    // let reservationData = {
    //     userName: '',
    //     partySize: 2,
    //     studentIds: [] as string[]
    // };

    // ตรวจสอบ session จาก data ที่ส่งมาจาก server
    $: session = data.session;
    
    // Redirect to auth if no session
    onMount(async () => {
        if (!session) {
            goto('/auth');
        }

        // await fetchTables();
        // console.log("------- BEFORE FETCHING TABLE STATUSES -------");
        // await fetchTableStatuses();
        // console.log("------- AFTER FETCHING TABLE STATUSES -------");

    });

    $: if (!session && browser) {
        window.location.href = '/auth';
    }

    // reactive statement
    // $: if (session?.user?.name) {
    //     reservationData.userName = session.user.name;
    // }

    $: stats = (() => {
        let available = 0, reserved = 0
        // tableStatuses.forEach((table: TableStatus) => {
        //     if (table.status === 'available') available++;
        //     else if (table.status === 'reserved') reserved++;
        // });
        return { available, reserved};
    })();
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
        
        <!-- Stats -->
        <!-- <Stats {stats} {tables} /> -->
        
        <!-- Legend -->
        <Legend />
        
        <!-- Tables -->
        <div class="mb-8">
            <h3 class="text-xl font-bold mb-4">ห้องแลปคอม</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3">
                <!-- {#each group.tables as table}
                    {@const status = getTableStatus(table.id, selectedTimeSlot, tableStatuses)}
                    {@const tableWithStatus = { ...table, status: status.status }}
                    <TableButton 
                        table={tableWithStatus}
                        {selectedTimeSlot}
                        {tableStatuses}
                        {getTableStatus}
                        {getStatusColor}
                        {getStatusText} 
                        on:click={({ detail }) => handleTableClick(detail)}
                    />
                {/each} -->
            </div>
        </div>

    </div>
</div>

{/if}