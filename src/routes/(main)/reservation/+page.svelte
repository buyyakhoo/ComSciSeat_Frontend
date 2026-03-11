<script lang="ts">
    import { onMount } from 'svelte';
    import { AlertCircle, TruckElectric } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import Table from '$lib/components/table/Table.svelte';
    import CancelReservationModal from '$lib/components/modal/CancelReservationModal.svelte';
    import type { ReservedTable } from '$lib/shared/types';
    import { enhance } from '$app/forms';
    import { mapSlotToDurationTime } from '$lib/shared/utils';
    import LoadingScreen from '$lib/components/decorate/LoadingScreen.svelte';
    
    let { data }: { data: PageData } = $props(); 
    let session = $derived(data.session);

    let reservedTables: ReservedTable[] = $derived(data.reservedTables)
    let error: string = $derived(data.error)
    let cancelReservationModal: ReturnType<typeof CancelReservationModal>;
    let isLoading: boolean = $state(true)

    const isPast = (dateStr: string, slot: string) => {
        const now = new Date()
        const bkkNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }))
        const bookingDate = new Date(dateStr)
        bookingDate.setHours(0, 0, 0, 0)
        bkkNow.setHours(0, 0, 0, 0)

        if (bookingDate < bkkNow) return true 
        if (bookingDate > bkkNow) return false

        const currentHour = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })).getHours()
        if (slot === "Morning") return currentHour >= 9
        if (slot === "Lunch") return currentHour >= 12
        if (slot === "Afternoon") return currentHour >= 13
        return false
    }

    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        isLoading = false;
    });

    $effect(() => {
        if (!session && browser) {
            window.location.href = '/auth';
        }
    });
</script>

<div class="min-h-screen bg-base-200 py-8 px-4">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center text-base-content">การจองของฉัน</h1>
        {#if isLoading}
            <LoadingScreen message="กำลังโหลดข้อมูลการจอง..." />
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
                    <th>{mapSlotToDurationTime(reserved.slot)}</th>
                    <th>
                        {#if !isPast(reserved.date, reserved.slot)}
                            <form
                                id="cancel-form-{reserved.booking_id}"
                                method="POST"
                                action="?/cancel"
                                use:enhance={() => {
                                    isLoading = true;
                                    return async ({ update }) => {
                                        await update();
                                        isLoading = false;
                                    };
                                }}
                            >
                                <input type="hidden" name="bookingId" value={reserved.booking_id} />
                                <button
                                    type="button"
                                    class="btn btn-sm btn-error"
                                    onclick={() => cancelReservationModal.showModal(
                                        reserved.booking_id,
                                        reserved.table_id,
                                        reserved.table_code,
                                        reserved.date,
                                        mapSlotToDurationTime(reserved.slot)
                                    )}
                                >
                                    ยกเลิก
                                </button>
                            </form>
                        {/if}
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
        (document.getElementById(`cancel-form-${bookingId}`) as HTMLFormElement)?.requestSubmit();
    }}
/>