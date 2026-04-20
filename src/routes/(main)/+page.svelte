<script lang="ts">
    import { goto } from '$app/navigation';
    import UserCard from '$lib/components/card/UserCard.svelte';
    import type { LabRoom, BookingStats, BookingStatsDescribe } from '$lib/shared/types/usermode';
    import RoomButton from '$lib/components/card/RoomButton.svelte';
    import StatsCard from '$lib/components/card/StatsCard.svelte';

    let { data }: { data: { user: any; labRooms: LabRoom[]; bookingStats: BookingStats } } = $props();
    let user = $derived(data.user);
    let labRooms: LabRoom[] = $derived(data.labRooms);
    let bookingStats: BookingStats = $derived(data.bookingStats);
    let bookingStatsDescribe: BookingStatsDescribe[] = $derived([
        {
            title: 'จำนวนการจองตั้งแต่วันนี้',
            value: bookingStats.userUpcoming,
            desc: 'รายการ'
        },
        {
            title: 'จำนวนการจองทั้งหมด',
            value: bookingStats.userTotal,
            desc: 'รายการ'
        },
        {
            title: 'คุณได้ทำการจอง',
            value: `${(bookingStats.percentage ?? 0).toFixed(2)}%`,
            desc: 'ของจำนวนการจองโต๊ะของสมาชิกทั้งหมด'
        }
    ])
</script>

<svelte:head>
    <title>หน้าแรก - ComSciSeat</title>
</svelte:head>

{#if !user}
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="text-center">
            <div class="loading loading-spinner loading-lg mb-4"></div>
            <p>กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-base-200">
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <UserCard {user} />
            <StatsCard statsDescribe={bookingStatsDescribe} />
            <div class="mb-8">
                <h3 class="text-xl font-bold mb-4">ห้องแลปคอม</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
                    {#each labRooms as labRoom}
                        <RoomButton 
                            allowed={true}
                            code={labRoom.lab_id.toString()}
                            describe={labRoom.lab_name}
                            onButton={() => {
                                goto(`/lab_tables/${labRoom.lab_id}`);
                            }}  
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}