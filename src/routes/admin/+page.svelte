<script lang="ts">
    import StatsCardSeparate from "$lib/components/card/StatsCardSeparate.svelte";
    import NavBarAdmin from "$lib/components/web_layout/NavBarAdmin.svelte";
    import UsersTab from "$lib/components/admin_tab/UsersTab.svelte";
    import SchedulesTab from "$lib/components/admin_tab/SchedulesTab.svelte";
    import TablesTab from "$lib/components/admin_tab/TablesTab.svelte";
    import LabsTab from "$lib/components/admin_tab/LabsTab.svelte";
    import BookingsTab from "$lib/components/admin_tab/BookingsTab.svelte";

    let { data } = $props();
    let activeTab: string = $state('dashboard');
    let adminStats = $derived(data.adminStats);
    let users = $derived(data.users ?? [])
    let labs = $derived(data.labs ?? [])
    let tables = $derived(data.tables ?? [])
    let bookings = $derived(data.bookings ?? [])
    let schedules = $derived(data.schedules ?? [])

    let stats = $derived([
        { label: 'การจองวันนี้', value: adminStats.bookingsToday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'การจองเมื่อวาน', value: adminStats.bookingsYesterday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'อัตราการจองวันนี้', value: adminStats.bookingRateToday ?? 0, sub: '%', color: 'text-success' },
        { label: 'ห้องแลป', value: adminStats.totalLabs ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'โต๊ะคอมทั้งหมด', value: adminStats.totalTables ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'ผู้ใช้งานทั้งหมด', value: adminStats.totalUsers ?? 0, sub: 'คน', color: '' }
    ])

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'bookings', label: 'การจอง', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'labs', label: 'ห้องแลป', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { id: 'tables', label: 'โต๊ะ', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
        { id: 'schedule', label: 'ตารางเรียน', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { id: 'users', label: 'ผู้ใช้งาน', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ]
</script>

<div class="drawer lg:drawer-open">
    <input id="drawer" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col min-h-screen">
        <NavBarAdmin {activeTab} />
        <div class="p-4 lg:p-8 flex-1 bg-base-200">
            {#if activeTab === 'dashboard'}
                <div class="mb-6">
                    <h1 class="text-2xl font-bold">ภาพรวมระบบ</h1>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {#each stats as stat}
                        <StatsCardSeparate {stat} />
                    {/each}
                </div>
            {:else if activeTab === 'bookings'}
                <BookingsTab {bookings} {labs} {tables} />
            {:else if activeTab === 'labs'}
                <LabsTab {labs} />
            {:else if activeTab === 'tables'}
                <TablesTab {tables} {labs} />
            {:else if activeTab === 'schedule'}
                <SchedulesTab {schedules} {labs} />
            {:else if activeTab === 'users'}
                <UsersTab {users} />
            {/if}
        </div>
    </div>

    <div class="drawer-side z-40">
        <label for="drawer" class="drawer-overlay"></label>
        <div class="w-60 min-h-full bg-base-100 border-r border-base-300 flex flex-col">
            <div class="p-4 border-b border-base-300">
                <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-primary rounded flex items-center justify-center">
                        <span class="text-primary-content text-xs font-bold font-mono">CS</span>
                    </div>
                    <div>
                        <div class="font-bold text-sm">ComSciSeat</div>
                        <div class="text-xs text-base-content/40 font-mono">admin panel</div>
                    </div>
                </div>
            </div>

            <nav class="flex-1 p-3 flex flex-col gap-1">
                {#each navItems as item}
                    <button
                        onclick={() => activeTab = item.id}
                        class="btn btn-ghost btn-sm justify-start gap-3 font-normal rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/>
                        </svg>
                        {item.label}
                    </button>
                {/each}
            </nav>

            <div class="p-3 border-t border-base-300">
                <a href="/" class="btn btn-ghost btn-sm justify-start gap-3 font-normal w-full text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    ออกจากหน้า Admin
                </a>
            </div>
        </div>
    </div>
</div>