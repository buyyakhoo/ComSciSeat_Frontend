<script lang="ts">
    import Legend from '$lib/components/lab/Legend.svelte';
    import type { LabData, LabHandleSelected } from '$lib/shared/types/usermode.js';
    import RoomButton from '$lib/components/card/RoomButton.svelte';
    import ReservationModal from '$lib/components/modal/ReservationModal.svelte';
    import LabRoomCard from '$lib/components/card/LabRoomCard.svelte';
    import ClassScheduleModal from '$lib/components/modal/ClassScheduleModal.svelte';
    import TimeDaySelect from '$lib/components/form_select/TimeDaySelect.svelte';
    import { mapSlotToDurationTime } from '$lib/shared/utils';
    import { CalendarDays, ArrowLeft, Info, AlertTriangle } from 'lucide-svelte';
    
    let { data } = $props();

    let labData: LabData = $derived({
        roomId: data.roomId,
        roomCode: data.roomCode,
        bookings: data.bookings,
        classPeriods: data.classPeriods,
    });

    let labHandleSelected: LabHandleSelected = $state({
        tables: [],
        status: 'OPENED',
        statusDescribe: '',
        isReserved: false,
        selectedDate: '',
        selectedTime: '',
    })

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

    const checkIsBooking = (selectedDate: string, slotValue: string) => {
        console.log("Debug: " + JSON.stringify(labData.bookings));
        const isBooking = labData.bookings
                        .some(booking => booking.date === selectedDate && booking.slot === slotValue)
        return isBooking
    }

    const checkIsClass = (selectedDayNum: number, slotValue: string) => {
        const isClass = labData.classPeriods
                .some(period => period.day_of_week === selectedDayNum && period.slot === slotValue)
        return isClass
    }

    const isSlotDisabled = (slotValue: string, selectedDate: string) => {
        if (!selectedDate) return true
        if (checkIsBooking(selectedDate, slotValue)) return true

        const selectedDayNum = new Date(selectedDate + 'T00:00:00').getDay();
        if (checkIsClass(selectedDayNum, slotValue)) return true

        if (selectedDate !== getTodayDate()) return false

        const bkkTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
        const currentHour = new Date(bkkTime).getHours()

        if (slotValue === 'Morning') return currentHour >= 9
        if (slotValue === 'Lunch') return currentHour >= 12;
        if (slotValue === 'Afternoon') return currentHour >= 13

        return false
    }
</script>

<div class="min-h-screen bg-base-200 p-4 lg:p-8">
    <div class="container flex flex-col gap-4 mx-auto max-w-6xl">

        {#snippet labTableHeader()}
            <h1 class="text-3xl font-bold">Lab Room {labData.roomCode}</h1>
            <p class="text-base-content/60">Live Seating Arrangement</p>
        {/snippet}

        {#snippet labTableActionCenter()}
            <button class="btn btn-ghost gap-2" onclick={() => classScheduleModal.showModal(labData.roomId, labData.roomCode, labData.classPeriods)}>
                <CalendarDays class="h-5 w-5" />
                Classroom Schedule
            </button>
        {/snippet}

        {#snippet labTableActionEnd()}
            <a href="/" class="btn btn-ghost gap-2">
                <ArrowLeft class="h-5 w-5" />
                Back to Labs
            </a>
        {/snippet}

        <LabRoomCard title={labTableHeader} actionCenter={labTableActionCenter} actionEnd={labTableActionEnd} />

        <TimeDaySelect 
            getTodayDate={getTodayDate}
            isSlotDisabled={isSlotDisabled} 
            bind:labHandleSelected={labHandleSelected} 
            labData={labData}
            onResult={(result: any) => {
                if (result?.type === 'success' && result?.data) {
                    labHandleSelected.tables = result.data.tables ?? [];
                    labHandleSelected.status = result.data.status;
                    labHandleSelected.statusDescribe = result.data.statusDescribe;
                    labHandleSelected.isReserved = result.data.isReserved;
                    isClicked = true;
                }
            }}
        />

        {#if !isClicked}
            <div class="alert alert-info shadow-lg">
                <Info class="stroke-current shrink-0 w-6 h-6" />
                <span>กรุณาเลือกวันที่และเวลาที่ต้องการจอง</span>
            </div>
        {:else if isLoading}
            <div class="flex justify-center items-center h-64">
                <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
        {:else if labHandleSelected.tables.length === 0 && labHandleSelected.status === 'CLOSED'}
            <div class="alert alert-error shadow-lg">
                <AlertTriangle class="stroke-current shrink-0 w-6 h-6" />
                <span>{labHandleSelected.statusDescribe}</span>
            </div>
        {:else if labHandleSelected.tables.length === 0 && labHandleSelected.status === 'OPENED'}
            <div class="alert alert-info shadow-lg">
                <Info class="stroke-current shrink-0 w-6 h-6" />
                <span>ไม่มีโต๊ะในห้องนี้</span>
            </div>
        {:else}
            <div class="bg-base-100 rounded-3xl p-8 lg:p-12 shadow-xl border border-base-300">
                <Legend />
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
                    {#each labHandleSelected.tables as table}
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
                                        labHandleSelected.selectedDate, 
                                        labHandleSelected.selectedTime, 
                                        labHandleSelected.isReserved,
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
            labHandleSelected.tables = resultData.tables;
            labHandleSelected.isReserved = resultData.isReserved;
            labHandleSelected.status = resultData.status;
            labHandleSelected.statusDescribe = resultData.statusDescribe;
        }
    }}
/>

<ClassScheduleModal
    bind:this={classScheduleModal}
    {mapSlotToDurationTime}
/>