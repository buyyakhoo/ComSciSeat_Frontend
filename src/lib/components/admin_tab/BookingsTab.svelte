<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import Table from '../table/Table.svelte'
    import { mapSlotToDurationTime } from '$lib/shared/utils'
    import AddBookingModal from '../modal/AddBookingModal.svelte'

    let { bookings, labs, tables } = $props()

    let filterStudent = $state('')
    let filterLab = $state('all')
    let filterSlot = $state('all')

    let filteredBookings = $derived(
        bookings.filter((b: any) => {
            const matchStudent = b.users?.user_id?.includes(filterStudent) || filterStudent === ''
            const matchLab = filterLab === 'all' || b.tables?.labs?.lab_name === filterLab
            const matchSlot = filterSlot === 'all' || b.slot === filterSlot
            return matchStudent && matchLab && matchSlot
        })
    )

    let addBookingModal: ReturnType<typeof AddBookingModal> = $state(null as any)
</script>

<div class="mb-6 flex justify-between items-center">
    <div>
        <h1 class="text-2xl font-bold">จัดการการจอง</h1>
        <p class="text-base-content/50 text-sm mt-1">ดูและยกเลิกการจองทั้งหมด</p>
    </div>
    <div class="badge badge-outline">{bookings.length} รายการ</div>
    <button class="btn btn-primary btn-sm" onclick={() => addBookingModal.showModal()}>
        + เพิ่มการจอง
    </button>
</div>

<div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
        <div class="flex gap-2 mb-4 flex-wrap">
            <input
                type="text"
                placeholder="ค้นหารหัสนักศึกษา..."
                class="input input-sm input-bordered flex-1 min-w-40"
                bind:value={filterStudent}
            />
            <select class="select select-sm select-bordered" bind:value={filterLab}>
                <option value="all">ทุกห้อง</option>
                {#each labs as lab}
                    <option value={lab.lab_name}>{lab.lab_name}</option>
                {/each}
            </select>
            <select class="select select-sm select-bordered" bind:value={filterSlot}>
                <option value="all">ทุก Slot</option>
                <option value="Morning">Morning</option>
                <option value="Lunch">Lunch</option>
                <option value="Afternoon">Afternoon</option>
            </select>
        </div>

        <div class="overflow-x-auto">
            {#snippet bookingHeader()}
                <th>ID</th>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ</th>
                <th>ห้อง / โต๊ะ</th>
                <th>วันที่</th>
                <th>ช่วงเวลา</th>
                <th>จัดการ</th>
            {/snippet}

            {#snippet bookingRow(b: any)}
                <td class="font-mono text-xs">{b.booking_id}</td>
                <td class="font-mono text-xs">{b.users?.user_id ?? '-'}</td>
                <td class="text-xs">{b.users?.name ?? '-'}</td>
                <td class="text-xs">{b.tables?.labs?.lab_name ?? '-'} / {b.tables?.table_code ?? '-'}</td>
                <td class="font-mono text-xs">{new Date(b.booking_date).toLocaleDateString('th-TH')}</td>
                <td><span class="badge badge-sm">{mapSlotToDurationTime(b.slot)}</span></td>
                <td>
                    <form method="POST" action="?/deleteBooking"
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update()
                                await invalidateAll()
                            }
                        }}
                    >
                        <input type="hidden" name="bookingId" value={b.booking_id} />
                        <button type="submit" class="btn btn-xs btn-error btn-outline">ยกเลิก</button>
                    </form>
                </td>
            {/snippet}

            <Table data={filteredBookings} header={bookingHeader} row={bookingRow} />
        </div>
    </div>
</div>

<AddBookingModal bind:this={addBookingModal} {labs} {tables} />