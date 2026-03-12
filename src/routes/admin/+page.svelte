<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import StatsCardSeparate from "$lib/components/card/StatsCardSeparate.svelte";
    import Table from "$lib/components/table/Table.svelte";
    import NavBarAdmin from "$lib/components/web_layout/NavBarAdmin.svelte";
    import { mapSlotToDurationTime } from "$lib/shared/utils/index.js";
    import AddClassScheduleModal from '$lib/components/modal/AddClassScheduleModal.svelte'
    import AdminCardHeader from "$lib/components/card/AdminCardHeader.svelte";
    import UsersTab from "$lib/components/admin_tab/UsersTab.svelte";
    import SchedulesTab from "$lib/components/admin_tab/SchedulesTab.svelte";
  import TablesTab from "$lib/components/admin_tab/TablesTab.svelte";

    let { data } = $props();
    let activeTab: string = $state('dashboard');
    let adminStats = $derived(data.adminStats);
    let users = $derived(data.users ?? [])
    let labs = $derived(data.labs ?? [])
    let tables = $derived(data.tables ?? [])
    const schedules = $derived(data.schedules ?? [])
    
    let addScheduleModal: ReturnType<typeof AddClassScheduleModal>

    let stats = $derived([
        { label: 'การจองวันนี้', value: adminStats.bookingsToday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'การจองเมื่อวาน', value: adminStats.bookingsYesterday ?? 0, sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'อัตราการจองวันนี้', value: adminStats.bookingRateToday ?? 0, sub: '%', color: 'text-success' },
        { label: 'ห้องแลป', value: adminStats.totalLabs ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'โต๊ะคอมทั้งหมด', value: adminStats.totalTables ?? 0, sub: 'โต๊ะ', color: 'text-success' },
        { label: 'ผู้ใช้งานทั้งหมด', value: adminStats.totalUsers ?? 0, sub: 'คน', color: '' }
    ])

    const recentBookings = [
        { id: '#1024', student: '65070001', lab: 'Lab 1 / A01', date: '2025-03-10', slot: 'Morning' },
        { id: '#1023', student: '65070042', lab: 'Lab 2 / B05', date: '2025-03-10', slot: 'Lunch' },
        { id: '#1022', student: '65070088', lab: 'Lab 1 / A03', date: '2025-03-11', slot: 'Afternoon' },
        { id: '#1021', student: '65070099', lab: 'Lab 3 / C02', date: '2025-03-11', slot: 'Morning' },
        { id: '#1020', student: '65070010', lab: 'Lab 2 / B01', date: '2025-03-12', slot: 'Lunch' },
    ]


    const DAY_NAMES: Record<number, string> = {
        1: 'จันทร์', 2: 'อังคาร', 3: 'พุธ', 4: 'พฤหัสบดี', 5: 'ศุกร์', 6: 'เสาร์', 0: 'อาทิตย์'
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'tables', label: 'โต๊ะ', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
        { id: 'bookings', label: 'การจอง', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
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
            {:else if activeTab === 'tables'}
                <TablesTab {tables} {labs} />
            {:else if activeTab === 'bookings'}
                <AdminCardHeader
                    title="จัดการการจอง"
                    describe="ดูและยกเลิกการจองทั้งหมด"
                    btnDetail="+ เพิ่มการจอง"
                />
                <div class="card bg-base-100 border border-base-300">
                    <div class="card-body p-4">
                        <div class="flex gap-2 mb-4 flex-wrap">
                            <input type="text" placeholder="ค้นหารหัสนักศึกษา..." class="input input-sm input-bordered flex-1 min-w-40">
                            <select class="select select-sm select-bordered">
                                <option>ทุกห้อง</option>
                            </select>
                            <select class="select select-sm select-bordered">
                                <option>ทุก Slot</option>
                                <option>Morning</option>
                                <option>Lunch</option>
                                <option>Afternoon</option>
                            </select>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="table table-sm">
                                <thead>
                                    <tr class="text-base-content/40 text-xs">
                                        <th>ID</th><th>รหัสนักศึกษา</th><th>ห้อง / โต๊ะ</th><th>วันที่</th><th>ช่วงเวลา</th><th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each recentBookings as b}
                                        <tr>
                                            <td class="font-mono text-xs">{b.id}</td>
                                            <td class="font-mono text-xs">{b.student}</td>
                                            <td>{b.lab}</td>
                                            <td class="font-mono text-xs">{b.date}</td>
                                            <td><span class="badge badge-sm">{b.slot}</span></td>
                                            <td><button class="btn btn-xs btn-error btn-outline">ยกเลิก</button></td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
<!-- 
<AddClassScheduleModal
    bind:this={addScheduleModal}
    {labs}
    {schedules}
/> -->