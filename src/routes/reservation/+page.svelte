<script lang="ts">
    import '../../app.css';
    import { onMount } from 'svelte';
    import { AlertCircle } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import NavBar from '$lib/components/initial/NavBar.svelte';
    import type { PageData } from './$types';
    import Table from '$lib/components/table/Table.svelte';
    import CancelReservationModal from '$lib/components/modal/CancelReservationModal.svelte';
    import type { ReservedTable } from '$lib/shared/types';
    
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_API_URL;
    let { data }: { data: PageData } = $props(); 
    let session = $derived(data.session);

    let loading: boolean = $state(true);
    let error: string = $state('');

    let cancelReservationModal: ReturnType<typeof CancelReservationModal>;

    let reservedTables: ReservedTable[] = $state([
        {
            booking_id: 0,
            table_id: 0,
            table_code: '',
            lab_id: 0,
            lab_name: '',
            date: '',
            slot: ''
        }
    ]);

    const loadReservations = async () => {
        loading = true
        try {
            const response = await fetch(`${BACKEND_URL}/api/reservations/my-bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.backendToken || ''}`
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json()
            const reservations = responseData.data;

            reservedTables = reservations.map((reservation: any) => ({
                booking_id: reservation.booking_id,
                table_id: reservation.table_id,
                table_code: reservation.tables.table_code,
                lab_id: reservation.tables.lab_id,
                lab_name: reservation.tables.labs.lab_name,
                date: reservation.booking_date.slice(0, 10),
                slot: reservation.slot
            }))

        } catch (error) {
            console.error('Error loading reservations:', error);
        } finally {
            loading = false;
        }
    }

    const cancelReservation = async (bookingId: number) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/reservations/cancel/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.backendToken || ''}`
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await loadReservations();
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    }

    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        await loadReservations();
    });

    $effect(() => {
        if (!session && browser) {
            window.location.href = '/auth';
        }
    });
</script>

<NavBar session={session} />

<div class="min-h-screen bg-base-200 py-8 px-4">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center text-base-content">การจองของฉัน</h1>
        
        {#if loading}
            <div class="flex justify-center items-center py-20">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        {:else if error}
            <div class="alert alert-error shadow-lg">
                <AlertCircle class="w-6 h-6" />
                <span>{error}</span>
            </div>
        {:else}
            <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                
                {#snippet reservedTableHeader()}
                    <th>โต๊ะ</th>
                    <th>ห้องแลป</th>
                    <th>วันที่</th>
                    <th>ช่วงเวลา</th>
                    <th>ยกเลิกการจอง</th>
                {/snippet}

                {#snippet reservedTableRows(reserved: ReservedTable)}
                    <th>{reserved.table_code}</th>
                    <th>{reserved.lab_name}</th>
                    <th>{reserved.date}</th>
                    <th>{reserved.slot}</th>
                    <th>
                        <button 
                            class="btn btn-sm btn-error" 
                            onclick={() => {
                                cancelReservationModal.showModal(reserved.booking_id, reserved.table_id, reserved.table_code, reserved.date, reserved.slot);
                            }}
                        >
                            ยกเลิก
                        </button>
                    </th>
                {/snippet}

                <Table data={reservedTables} header={reservedTableHeader} row={reservedTableRows} />
            </div>
        {/if}
    </div>
</div>

<CancelReservationModal 
    bind:this={cancelReservationModal} 
    onReservationCancelSuccess={(bookingId: number) =>{
        cancelReservation(bookingId);
    }}
/>