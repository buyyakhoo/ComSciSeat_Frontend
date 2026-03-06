<script lang="ts">
    import '../../../app.css'
    import NavBar from '$lib/components/web_layout/NavBar.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import Legend from '$lib/components/lab/Legend.svelte';
    import type { LabData } from '$lib/shared/types';
    import { browser } from '$app/environment';
    import RoomButton from '$lib/components/card/RoomButton.svelte';
    import ReservationModal from '$lib/components/modal/ReservationModal.svelte';
    import LabRoomCard from '$lib/components/card/LabRoomCard.svelte';
    import ClassScheduleModal from '$lib/components/modal/ClassScheduleModal.svelte';
    import TimeDaySelect from '$lib/components/form/TimeDaySelect.svelte';
    import { mapSlotToDurationTime } from '$lib/shared/utils';
    
    let { data, form } = $props();
    let session = $derived(data?.session);

    let labData: LabData = $state({
        roomId: data.roomId,
        tables: [],
        bookings: data.bookings,
        classPeriods: data.classPeriods,
        status: 'OPENED',
        statusDescribe: '',
        isReserved: false,
        selectedDate: '',
        selectedTime: '',
    });

    let isLoading: boolean = $state(false);
    let isClicked: boolean = $state(false);
    let reservationModal: ReturnType<typeof ReservationModal>;
    let classScheduleModal: ReturnType<typeof ClassScheduleModal>;

    const getTodayDate = () => {
        const today = new Date();
        return today.toLocaleDateString("en-CA", {
            timeZone: 'Asia/Bangkok'
        })
    }

    const isSlotDisabled = (slotValue: string, selectedDate: string) => {
        const isBooking = labData.bookings
                .some(booking => booking.date === selectedDate && booking.slot === slotValue)
        if (isBooking) return true

        const selectedDayNum = new Date(selectedDate).getDay();
        const isClass = labData.classPeriods
                .some(period => period.day_of_week === selectedDayNum && period.slot === slotValue)
        if (isClass) return true

        if (selectedDate !== getTodayDate()) return false

        const bkkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
        const currentHour = new Date(bkkTime).getHours()

        if (slotValue === 'Morning') return currentHour >= 9
        if (slotValue === 'Lunch') return currentHour >= 12;
        if (slotValue === 'Afternoon') return currentHour >= 13

        return false
    }
</script>

<NavBar {session} />

<!-- Content -->
<div class="min-h-screen bg-base-200 p-4 lg:p-8">
    <div class="container flex flex-col gap-4 mx-auto max-w-6xl">

        {#snippet labTableHeader()}
            <h1 class="text-3xl font-bold">Lab Room {labData.roomId}</h1>
            <p class="text-base-content/60">Live Seating Arrangement</p>
        {/snippet}

        {#snippet labTableActionCenter()}
            <button class="btn btn-ghost gap-2" onclick={() => classScheduleModal.showModal(labData.roomId, labData.classPeriods)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M9 10v12M15 10v12M3 14h18M3 18h18" /></svg>
                Classroom Schedule
            </button>
        {/snippet}

        {#snippet labTableActionEnd()}
            <a href="/" class="btn btn-ghost gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Labs
            </a>
        {/snippet}

        <LabRoomCard title={labTableHeader} actionCenter={labTableActionCenter} actionEnd={labTableActionEnd} />

        <TimeDaySelect 
            getTodayDate={getTodayDate} 
            isSlotDisabled={isSlotDisabled} 
            labData={labData} 
            onResult={(result: any) => {
                if (result?.type === 'success' && result?.data) {
                    labData.tables = result.data.tables;
                    labData.status = result.data.status;
                    labData.statusDescribe = result.data.statusDescribe;
                    labData.isReserved = result.data.isReserved;
                    isClicked = true;
                }
            }}
        />

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
                        <RoomButton
                            allowed={table.is_available}
                            code={table.table_code}
                            allowedDisplay="ว่าง"
                            notAllowedDisplay="จองแล้ว"  
                            onButton={() => {
                                if (table.is_available) {
                                    reservationModal.showModal(
                                        table.table_id, 
                                        table.table_code, 
                                        labData.selectedDate, 
                                        labData.selectedTime, 
                                        labData.isReserved,
                                        labData.roomId
                                    );
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
    onReservationSuccess={(resultData: any) => {
        if (resultData?.tables) {
            labData.tables = resultData.tables;
            labData.isReserved = resultData.isReserved;
            labData.status = resultData.status;
            labData.statusDescribe = resultData.statusDescribe;
        }
    }}
/>

<ClassScheduleModal
    bind:this={classScheduleModal}
    {mapSlotToDurationTime}
/>