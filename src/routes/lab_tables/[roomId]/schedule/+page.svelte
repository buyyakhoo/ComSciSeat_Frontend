<script lang="ts">
    import '../../../../app.css'
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import NavBar from "$lib/components/initial/NavBar.svelte";
    import { onMount } from "svelte";
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import type { ScheduleData } from '$lib/shared/types';
    import ClassScheduleHorizontal from '$lib/components/schedule/ClassScheduleHorizontal.svelte';
    import LabRoomCard from '$lib/components/card/LabRoomCard.svelte';

    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_API_URL;
    let { data }: { data: PageData } = $props(); 
    let session = $derived(data?.session);
    
    let scheduleData: ScheduleData = $state({
        roomId: $page.params.roomId,
        classPeriods: []
    });

    const mapSlotToDurationTime = (slot: string) => {
        if (slot === "Morning") {
            return "09:00 - 12:00"
        }
        else if (slot === "Lunch") {
            return "12:00 - 13:00"
        }
        else if (slot === "Afternoon") {
            return "13:00 - 16:00"
        }
        return "Error"
    }

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

    const fetchClassSchedule = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/labs/${scheduleData.roomId}/class_schedule`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.ok) {
                const data = await response.json();
                scheduleData.classPeriods = data.data;
                // console.log(data.data)
            }

        } catch (error) {
            console.error('Error fetching class schedule:', error);
        }
    }

    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        await fetchClassSchedule();
    });

    $effect(() => {
        if (!session && browser) {
            window.location.href = '/auth';
        }
    });

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const times = [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", 
        "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    ];

</script>

<NavBar {session} />

<!-- Content -->
<div class="min-h-screen bg-base-200 p-4 lg:p-8">
    <div class="container flex flex-col gap-4 mx-auto max-w-6xl">
        {#snippet labScheduleHeader()}
            <h1 class="text-3xl font-bold">Lab Room {scheduleData.roomId}</h1>
            <p class="text-base-content/60">Class Schedule</p>
        {/snippet}

        {#snippet labScheduleActionEnd()}
            <a href="/lab_tables/{scheduleData.roomId}" class="btn btn-ghost gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Tables
            </a>
        {/snippet}

        <LabRoomCard title={labScheduleHeader} actionCenter={undefined} actionEnd={labScheduleActionEnd} />

        <ClassScheduleHorizontal 
            {times} 
            {weekdays} 
            {scheduleData} 
            {mapSlotToDurationTime} 
            {getGridClasses}
        />

        <!-- <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {#each scheduleData.classPeriods as period}
                        <tr>
                            <td>{period.day_of_week}</td>
                            <td>{mapSlotToDurationTime(period.slot)}</td>
                            <td>{period.subject}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div> -->
    </div>
</div>