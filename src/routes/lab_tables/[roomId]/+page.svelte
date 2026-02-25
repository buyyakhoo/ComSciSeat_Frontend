<script lang="ts">
    import '../../../app.css'
    import { page } from '$app/stores';
    import NavBar from '$lib/components/initial/NavBar.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import Legend from '$lib/components/lab/Legend.svelte';
    import type { LabData, TableReservation } from '$lib/shared/types';
    import { browser } from '$app/environment';
    import RoomButton from '$lib/components/card/RoomButton.svelte';
    import ReservationModal from '$lib/components/modal/ReservationModal.svelte';
    
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_API_URL;
    let { data }: { data: PageData } = $props(); 
    let session = $derived(data?.session);

    let labData: LabData = $state({
        roomId: parseInt($page.params.roomId || "0"),
        tables: [] as TableReservation[],
        status: 'OPENED',
        statusDescribe: '',
        isReserved: false,
        selectedDate: '',
        selectedTime: '',
    });

    let isLoading: boolean = $state(false);
    let isClicked: boolean = $state(false);
    let reservationModal: ReturnType<typeof ReservationModal>;

    const reserveTable = async (tableId: number) => {
        try {
            if (labData.isReserved) {
                alert('คุณมีการจองโต๊ะในช่วงเวลานี้แล้ว กรุณายกเลิกการจองก่อนทำการจองใหม่');
                return;
            }
            await fetch(`${BACKEND_URL}/api/reservations/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.backendToken || ''}`
                },
                body: JSON.stringify({
                    table_id: tableId,
                    date: labData.selectedDate,
                    slot: labData.selectedTime
                })
            })
        } catch (error) {
            console.error('Error reserving table:', error);
        }
        await fetchTables();
    }

    const fetchTables = async () => {
        isClicked = true;
        isLoading = true;
        try {
            // Using your backend port 3000 and the route defined in index.ts
            const response = await fetch(`${BACKEND_URL}/api/reservations/availability?lab_id=${labData.roomId}&date=${labData.selectedDate}&slot=${labData.selectedTime}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (result.success) {
                labData.tables = result.data;
                labData.status = result.status;
                labData.statusDescribe = result.message;
                labData.isReserved = result.isReserved;
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            isLoading = false;
        }
    };

    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
    });

    $effect(() => {
        if (!session && browser) {
            window.location.href = '/auth';
        }
    });

</script>

<NavBar {session} />

<!-- Content -->
<div class="min-h-screen bg-base-200 p-4 lg:p-8">
    <div class="container flex flex-col gap-4 mx-auto max-w-6xl">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold">Lab Room {labData.roomId}</h1>
                <p class="text-base-content/60">Live Seating Arrangement</p>
            </div>
            <a href="/" class="btn btn-ghost gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Labs
            </a>
        </div>

        <fieldset class="fieldset m-auto bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">เลือกเวลาที่ต้องการจอง</legend>

            <label class="label" for="dateInput">วันที่</label>
            <input id="dateInput" type="date" class="input" bind:value={labData.selectedDate} />

            <label class="label" for="timeInput">เวลา</label>
            <select id="timeInput" class="select" bind:value={labData.selectedTime}>
                <option disabled selected>เลือกเวลา</option>
                <option value="Morning">09:00 - 12:00</option>
                <option value="Lunch">12:00 - 13:00</option>
                <option value="Afternoon">13:00 - 16:00</option>
            </select>

             <button class="btn btn-neutral mt-4" onclick={() => fetchTables()}>เลือกเวลา</button>
        </fieldset> 

        {#if !isClicked}
            <div class="alert alert-info shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>กรุณาเลือกวันที่และเวลาที่ต้องการจอง</span>
            </div>
        {:else if isLoading}
            <div class="flex justify-center items-center h-64">
                <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
        {:else if labData.tables.length === 0 && labData.status === 'CLOSED'}
            <div class="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span>{labData.statusDescribe}</span>
            </div>
        {:else if labData.tables.length === 0 && labData.status === 'OPENED'}
            <div class="alert alert-info shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>ไม่มีโต๊ะในห้องนี้</span>
            </div>
        {:else}
            <div class="bg-base-100 rounded-3xl p-8 lg:p-12 shadow-xl border border-base-300">
                <Legend />
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
                    {#each labData.tables as table}
                    <!-- making component on RoomButton -->
                        <RoomButton
                            allowed={table.is_available}
                            code={table.table_code}
                            allowedDisplay="ว่าง"
                            notAllowedDisplay="จองแล้ว"  
                            onButton={() => {
                                if (table.is_available) {
                                    reservationModal.showModal(table.table_id, table.table_code, labData.selectedDate, labData.selectedTime, labData.isReserved);
                                }
                            }}
                        />  
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<ReservationModal 
    bind:this={reservationModal}
    onReservationSuccess={(tableId: number) => {
        reserveTable(tableId);
    }}
/>