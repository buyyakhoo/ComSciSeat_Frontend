<script lang="ts">
    import type { ScheduleData } from "$lib/shared/types/usermode";

    interface HorizontalDayProps {
        day: string;
        scheduleData: ScheduleData;
        mapSlotToDurationTime: (slot: string) => string;
        getGridClasses: (slot: string) => string;
        classPeriodFilterDay: (day: string) => any[];
    }

    let { day, scheduleData, mapSlotToDurationTime, getGridClasses, classPeriodFilterDay }: HorizontalDayProps = $props();
</script>

<div class="grid grid-cols-8 gap-2 h-12">
    <div class="flex items-center pr-4 text-sm font-semibold text-base-content/70">
        {day.slice(0, 3)}
    </div>
    
    <div class="grid grid-cols-7 col-span-7 gap-1 rounded-lg p-1 relative">
        {#each classPeriodFilterDay(day) as period}
            <div class="rounded-lg h-12 p-2 shadow-sm flex flex-col justify-center overflow-hidden {getGridClasses(period.slot)} hover:opacity-90 transition-opacity cursor-pointer">
                <span class="font-bold text-sm truncate">{period.subject}</span>
                <span class="text-xs opacity-80 truncate">{mapSlotToDurationTime(period.slot)}</span>
            </div>
        {/each}
    </div>
</div>