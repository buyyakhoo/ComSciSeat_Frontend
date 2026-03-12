<script lang="ts">
    import type { ScheduleData } from "$lib/shared/types/usermode";
    import HorizontalDay from "./HorizontalDay.svelte";
    
    interface ClassScheduleHorizontalProps {
        times: string[]
        weekdays: string[]
        scheduleData: ScheduleData
        mapSlotToDurationTime: (slot: string) => string
        getGridClasses: (slot: string) => string
    }

    const classPeriodFilterDay = (day: string) => {
        const slotOrder = ['Morning', 'Lunch', 'Afternoon']
        return scheduleData.classPeriods
                            .filter(p => weekdays[p.day_of_week-1] === day)
                            .sort((a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot))
    }
    let { times, weekdays, scheduleData, mapSlotToDurationTime, getGridClasses }: ClassScheduleHorizontalProps = $props();
</script>

<div class="card bg-base-100 shadow-xl border border-base-200 w-full overflow-hidden">
    <div class="card-body overflow-x-auto">
        <div class="min-w-lg md:min-w-5xl">
            <div class="grid grid-cols-8 gap-2 mb-2">
                <div></div>
                {#each times as time}
                    <div class="text-center border-l-2 border-base-content/30 text-xs lg:text-sm font-medium text-base-content/60">{time}</div>
                {/each}
            </div>

            <div class="flex flex-col gap-3">
                {#each weekdays as day}
                    <HorizontalDay 
                        {day} 
                        {scheduleData} 
                        {mapSlotToDurationTime} 
                        {getGridClasses}
                        {classPeriodFilterDay}
                    />
                {/each}
            </div>
        </div>
    </div>
</div>