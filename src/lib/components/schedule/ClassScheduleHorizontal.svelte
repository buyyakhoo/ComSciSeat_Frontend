<script lang="ts">
    import type { ScheduleData } from "$lib/shared/types";
    
    interface ClassScheduleHorizontalProps {
        times: string[]
        weekdays: string[]
        scheduleData: ScheduleData
        mapSlotToDurationTime: (slot: string) => string
        getGridClasses: (slot: string) => string
    }
    
    let { times, weekdays, scheduleData, mapSlotToDurationTime, getGridClasses }: ClassScheduleHorizontalProps = $props();
</script>

<div class="card bg-base-100 shadow-xl border border-base-200 w-full overflow-hidden">
    <div class="card-body p-4 lg:p-8 overflow-x-auto">
        <div class="min-w-[1000px]">
            <div class="grid grid-cols-8 gap-2 mb-6">
                <div></div>
                {#each times as time}
                    <div class="border-l-2 border-base-200 pl-3 text-xs lg:text-sm font-medium text-base-content/60">{time}</div>
                {/each}
            </div>

            <div class="flex flex-col gap-3">
                {#each weekdays as day}
                    <div class="grid grid-cols-8 gap-2 min-h-12">
                        <div class="flex items-center text-sm font-semibold text-base-content/70 pr-4">
                            {day.slice(0, 3)}
                        </div>
                        
                        <div class="grid grid-cols-7 col-span-7 gap-1 rounded-lg p-1 relative">
                            {#each scheduleData.classPeriods.filter(p => weekdays[p.day_of_week-1] === day) as period}
                                <div class="rounded-lg p-3 shadow-sm flex flex-col justify-center overflow-hidden {getGridClasses(period.slot)} hover:opacity-90 transition-opacity cursor-pointer">
                                    <span class="font-bold text-sm truncate">{period.subject}</span>
                                    <span class="text-xs opacity-80 truncate">{mapSlotToDurationTime(period.slot)}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>