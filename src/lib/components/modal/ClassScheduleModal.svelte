<script lang="ts">
    import type { ClassPeriod, ScheduleData } from '$lib/shared/types';
    import ClassScheduleHorizontal from '../schedule/ClassScheduleHorizontal.svelte';
    import ModalBox from './ModalBox.svelte';

    let { mapSlotToDurationTime } = $props();
    let dialogElement: HTMLDialogElement;

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const times = [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", 
        "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    ];

    const getGridClasses = (slot: string) => {
        if (slot === "Morning") {
            // 09:00 - 12:00
            return "col-start-1 col-span-3 bg-secondary text-white";
        } else if (slot === "Lunch") {
            // 12:00 - 13:00
            return "col-start-4 col-span-1 bg-secondary text-white";
        } else if (slot === "Afternoon") {
            // 13:00 - 16:00
            return "col-start-5 col-span-3 bg-secondary text-white";
        }
        return "hidden";
    }

    let scheduleData: ScheduleData = $state({
        roomId: 0,
        classPeriods: []
    });

    export const showModal = (roomId: number, classPeriod: ClassPeriod[]) => {
        scheduleData.roomId = roomId;
        scheduleData.classPeriods = classPeriod;
        dialogElement.showModal();
    }
    
</script>

<dialog 
    bind:this={dialogElement} 
    class="modal modal-bottom sm:modal-middle"
    onclick={(e) => { if (e.target === dialogElement) dialogElement.close() }}
>

    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">
            ตารางเรียนของห้องปฏิบัติการ {scheduleData.roomId}
        </h3>
    {/snippet}

    {#snippet modalBoxContent()}
        <ClassScheduleHorizontal 
            {times} 
            {weekdays} 
            {scheduleData} 
            {mapSlotToDurationTime} 
            {getGridClasses}
        />
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button class="btn btn-ghost">ย้อนกลับ</button>
    {/snippet}

    <ModalBox 
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
        modalSize="md:max-w-7xl md:w-11/12"
    />
</dialog>