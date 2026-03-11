<script lang="ts">
    let activeTab = $state('dashboard');

    const stats = [
        { label: 'การจองวันนี้', value: '48', sub: 'โต๊ะ', color: 'text-primary' },
        { label: 'โต๊ะที่ว่างวันนี้', value: '32', sub: 'โต๊ะ', color: 'text-success' },
        { label: 'ผู้ใช้งานทั้งหมด', value: '214', sub: 'คน', color: '' }
    ]

    const recentBookings = [
        { id: '#1024', student: '65070001', lab: 'Lab 1 / A01', date: '2025-03-10', slot: 'Morning' },
        { id: '#1023', student: '65070042', lab: 'Lab 2 / B05', date: '2025-03-10', slot: 'Lunch' },
        { id: '#1022', student: '65070088', lab: 'Lab 1 / A03', date: '2025-03-11', slot: 'Afternoon' },
        { id: '#1021', student: '65070099', lab: 'Lab 3 / C02', date: '2025-03-11', slot: 'Morning' },
        { id: '#1020', student: '65070010', lab: 'Lab 2 / B01', date: '2025-03-12', slot: 'Lunch' },
    ]

    const rooms = [
        { name: 'Lab 1', used: 14, total: 20 },
        { name: 'Lab 2', used: 8, total: 20 },
        { name: 'Lab 3', used: 4, total: 20 },
        { name: 'Lab 4', used: 0, total: 20, closed: true },
        { name: 'Lab 5', used: 0, total: 20, closed: true },
    ]

    const schedules = [
        { lab: 'Lab 1', subject: 'Python Programming', day: 'จันทร์', slot: 'Morning' },
        { lab: 'Lab 1', subject: 'Web Programming', day: 'อังคาร', slot: 'Morning' },
        { lab: 'Lab 1', subject: 'Big Data Architecture', day: 'พุธ', slot: 'Lunch' },
        { lab: 'Lab 2', subject: 'Algorithm Design', day: 'พุธ', slot: 'Morning' },
    ]

    const users = [
        { id: '65070001', name: 'สมชาย ใจดี', email: '65070001@kmitl.ac.th', role: 'student', bookings: 12 },
        { id: '65070042', name: 'สมหญิง รักเรียน', email: '65070042@kmitl.ac.th', role: 'student', bookings: 8 },
        { id: 'Prof001', name: 'อ.วิชัย สอนดี', email: 'wichai@kmitl.ac.th', role: 'admin', bookings: 0 },
    ]

    const slotBadge: Record<string, string> = {
        Morning: 'badge-warning',
        Lunch: 'badge-info',
        Afternoon: 'badge-success',
    }

    let showAddScheduleModal = $state(false)

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'bookings', label: 'การจอง', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { id: 'schedule', label: 'ตารางเรียน', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { id: 'users', label: 'ผู้ใช้งาน', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ]
</script>

<div class="drawer lg:drawer-open">
    <input id="drawer" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col min-h-screen">
        <!-- Navbar -->
        <div class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6 sticky top-0 z-10">
            <div class="flex-none lg:hidden">
                <label for="drawer" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </label>
            </div>
            <div class="flex-1">
                <span class="text-base-content/50 text-sm font-mono">admin / {activeTab}</span>
            </div>
            <div class="flex-none gap-2 items-center">
                <div class="badge badge-error badge-sm gap-1">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-error-content animate-pulse"></span>
                    LIVE
                </div>
                <div class="avatar placeholder">
                    <div class="bg-primary text-primary-content rounded-full w-8">
                        <span class="text-xs">AD</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 lg:p-8 flex-1 bg-base-200">

            <!-- Dashboard -->
            {#if activeTab === 'dashboard'}
                <div class="mb-6">
                    <h1 class="text-2xl font-bold">ภาพรวมระบบ</h1>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {#each stats as stat}
                        <div class="card bg-base-100 border border-base-300 p-4 hover:-translate-y-1 transition-transform">
                            <div class="text-base-content/50 text-xs font-mono mb-2">{stat.label}</div>
                            <div class="text-3xl font-bold font-mono {stat.color}">{stat.value}</div>
                            <div class="text-xs text-base-content/40 mt-1">{stat.sub}</div>
                        </div>
                    {/each}
                </div>

                <div class="grid lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2 card bg-base-100 border border-base-300">
                        <div class="card-body p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="font-semibold">การจองล่าสุด</h2>
                                <button class="btn btn-xs btn-ghost" onclick={() => activeTab = 'bookings'}>ดูทั้งหมด →</button>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="table table-sm">
                                    <thead>
                                        <tr class="text-base-content/40 text-xs">
                                            <th>ผู้จอง</th><th>ห้อง / โต๊ะ</th><th>วันที่</th><th>ช่วงเวลา</th><th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each recentBookings.slice(0, 4) as b}
                                            <tr>
                                                <td class="font-mono text-xs">{b.student}</td>
                                                <td>{b.lab}</td>
                                                <td class="font-mono text-xs">{b.date}</td>
                                                <td><span class="badge badge-sm {slotBadge[b.slot]}">{b.slot}</span></td>
                                                <td><button class="btn btn-xs btn-error btn-outline">ยกเลิก</button></td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="card bg-base-100 border border-base-300">
                        <div class="card-body p-4">
                            <h2 class="font-semibold mb-4">สถานะห้อง</h2>
                            <div class="flex flex-col gap-3">
                                {#each rooms as room}
                                    <div class="flex justify-between items-center" class:opacity-40={room.closed}>
                                        <span class="text-sm">{room.name}</span>
                                        {#if room.closed}
                                            <span class="badge badge-sm">ปิด</span>
                                        {:else}
                                            <div class="flex items-center gap-2">
                                                <progress
                                                    class="progress w-20 {room.used / room.total > 0.6 ? 'progress-primary' : 'progress-success'}"
                                                    value={room.used}
                                                    max={room.total}
                                                ></progress>
                                                <span class="font-mono text-xs">{room.used}/{room.total}</span>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

            <!-- Bookings -->
            {:else if activeTab === 'bookings'}
                <div class="mb-6">
                    <h1 class="text-2xl font-bold">จัดการการจอง</h1>
                    <p class="text-base-content/50 text-sm mt-1">ดูและยกเลิกการจองทั้งหมด</p>
                </div>
                <div class="card bg-base-100 border border-base-300">
                    <div class="card-body p-4">
                        <div class="flex gap-2 mb-4 flex-wrap">
                            <input type="text" placeholder="ค้นหารหัสนักศึกษา..." class="input input-sm input-bordered flex-1 min-w-40">
                            <select class="select select-sm select-bordered">
                                <option>ทุกห้อง</option>
                                {#each rooms.filter(r => !r.closed) as room}
                                    <option>{room.name}</option>
                                {/each}
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
                                            <td><span class="badge badge-sm {slotBadge[b.slot]}">{b.slot}</span></td>
                                            <td><button class="btn btn-xs btn-error btn-outline">ยกเลิก</button></td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            <!-- Schedule -->
            {:else if activeTab === 'schedule'}
                <div class="mb-6 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold">ตารางเรียน</h1>
                        <p class="text-base-content/50 text-sm mt-1">จัดการตารางเรียนแต่ละห้อง</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick={() => showAddScheduleModal = true}>
                        + เพิ่มตารางเรียน
                    </button>
                </div>
                <div class="card bg-base-100 border border-base-300">
                    <div class="card-body p-4">
                        <div class="overflow-x-auto">
                            <table class="table table-sm">
                                <thead>
                                    <tr class="text-base-content/40 text-xs">
                                        <th>ห้อง</th><th>วิชา</th><th>วัน</th><th>ช่วงเวลา</th><th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each schedules as s}
                                        <tr>
                                            <td>{s.lab}</td>
                                            <td>{s.subject}</td>
                                            <td>{s.day}</td>
                                            <td><span class="badge badge-sm {slotBadge[s.slot]}">{s.slot}</span></td>
                                            <td><button class="btn btn-xs btn-error btn-outline">ลบ</button></td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            <!-- Users -->
            {:else if activeTab === 'users'}
                <div class="mb-6">
                    <h1 class="text-2xl font-bold">จัดการผู้ใช้</h1>
                    <p class="text-base-content/50 text-sm mt-1">นักศึกษาและอาจารย์ทั้งหมด</p>
                </div>
                <div class="card bg-base-100 border border-base-300">
                    <div class="card-body p-4">
                        <input type="text" placeholder="ค้นหา..." class="input input-sm input-bordered mb-4 w-full max-w-xs">
                        <div class="overflow-x-auto">
                            <table class="table table-sm">
                                <thead>
                                    <tr class="text-base-content/40 text-xs">
                                        <th>รหัส</th><th>ชื่อ</th><th>อีเมล</th><th>Role</th><th>จองทั้งหมด</th><th>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each users as u}
                                        <tr>
                                            <td class="font-mono text-xs">{u.id}</td>
                                            <td>{u.name}</td>
                                            <td class="text-xs">{u.email}</td>
                                            <td>
                                                <span class="badge badge-sm {u.role === 'admin' ? 'badge-secondary' : 'badge-primary'}">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td class="font-mono text-xs text-center">{u.bookings || '—'}</td>
                                            <td><button class="btn btn-xs btn-outline">แก้ไข Role</button></td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Sidebar -->
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
                        class:bg-primary={activeTab === item.id}
                        class:bg-opacity-15={activeTab === item.id}
                        class:text-primary={activeTab === item.id}
                        class:border-l-2={activeTab === item.id}
                        class:border-primary={activeTab === item.id}
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
                    ออกจากระบบ
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Add Schedule -->
{#if showAddScheduleModal}
    <dialog open class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">เพิ่มตารางเรียน</h3>
            <div class="flex flex-col gap-3">
                <select class="select select-bordered select-sm w-full">
                    <option disabled selected>เลือกห้อง</option>
                    {#each rooms.filter(r => !r.closed) as room}
                        <option>{room.name}</option>
                    {/each}
                </select>
                <input type="text" placeholder="ชื่อวิชา" class="input input-bordered input-sm w-full">
                <select class="select select-bordered select-sm w-full">
                    <option disabled selected>วันในสัปดาห์</option>
                    {#each ['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'] as day}
                        <option>{day}</option>
                    {/each}
                </select>
                <select class="select select-bordered select-sm w-full">
                    <option disabled selected>ช่วงเวลา</option>
                    <option>Morning (09:00-12:00)</option>
                    <option>Lunch (12:00-13:00)</option>
                    <option>Afternoon (13:00-16:00)</option>
                </select>
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost btn-sm" onclick={() => showAddScheduleModal = false}>ยกเลิก</button>
                <button class="btn btn-primary btn-sm" onclick={() => showAddScheduleModal = false}>บันทึก</button>
            </div>
        </div>
        <div class="modal-backdrop" role="button" tabindex="0"
            onclick={() => showAddScheduleModal = false}
            onkeydown={() => showAddScheduleModal = false}>
        </div>
    </dialog>
{/if}