<script lang="ts">
    import StatsCardSeparate from "$lib/components/card/StatsCardSeparate.svelte";
    import NavBarAdmin from "$lib/components/web_layout/NavBarAdmin.svelte";
    import UsersTab from "$lib/components/admin_tab/UsersTab.svelte";
    import SchedulesTab from "$lib/components/admin_tab/SchedulesTab.svelte";
    import TablesTab from "$lib/components/admin_tab/TablesTab.svelte";
    import LabsTab from "$lib/components/admin_tab/LabsTab.svelte";
    import BookingsTab from "$lib/components/admin_tab/BookingsTab.svelte";
    import { LayoutDashboard, CalendarDays, Building2, Table, BookOpen, Users, LogOut } from 'lucide-svelte';

    let { data } = $props();
    let activeTab: string = $state('dashboard');
    let adminStats = $derived(data.adminStats);
    let users = $derived(data.users ?? [])
    let labs = $derived(data.labs ?? [])
    let tables = $derived(data.tables ?? [])
    let bookings = $derived(data.bookings ?? [])
    let schedules = $derived(data.schedules ?? [])
    let loadErrors: string[] = $derived(data.loadErrors ?? [])

    let stats = $derived([
        { label: 'การจองทั้งหมด', value: adminStats.allBookings ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'การจองวันนี้', value: adminStats.bookingsToday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'การจองเมื่อวาน', value: adminStats.bookingsYesterday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'ห้องแลป', value: adminStats.totalLabs ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'โต๊ะคอมทั้งหมด', value: adminStats.totalTables ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'ผู้ใช้งานทั้งหมด', value: adminStats.totalUsers ?? 0, sub: 'คน', color: '' }
    ])

    const navItems = [
        { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
        { id: 'bookings',  label: 'การจอง',      icon: CalendarDays },
        { id: 'labs',      label: 'ห้องแลป',     icon: Building2 },
        { id: 'tables',    label: 'โต๊ะ',        icon: Table },
        { id: 'schedule',  label: 'ตารางเรียน',  icon: BookOpen },
        { id: 'users',     label: 'ผู้ใช้งาน',   icon: Users },
    ]
</script>

<div class="drawer lg:drawer-open">
    <input id="drawer" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col min-h-screen">
        <NavBarAdmin {activeTab} />
        <div class="p-4 lg:p-8 flex-1 bg-base-200">
            {#if loadErrors.length > 0}
                <div class="alert alert-warning mb-6">
                    <span>Admin data failed to load: {loadErrors.join(', ')}</span>
                </div>
            {/if}
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
                        <item.icon class="h-4 w-4" />
                        {item.label}
                    </button>
                {/each}
            </nav>

            <div class="p-3 border-t border-base-300">
                <a href="/" class="btn btn-ghost btn-sm justify-start gap-3 font-normal w-full text-error">
                    <LogOut class="h-4 w-4" />
                    ออกจากหน้า Admin
                </a>
            </div>
        </div>
    </div>
</div>
