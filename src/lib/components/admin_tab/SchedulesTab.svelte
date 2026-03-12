<script lang="ts">
    import { invalidateAll } from '$app/navigation'
    import { enhance } from '$app/forms'
    import Table from '../table/Table.svelte'
    import AddClassScheduleModal from '../modal/AddClassScheduleModal.svelte'
    import { DAY_NAMES, mapSlotToDurationTime } from '$lib/shared/utils'
  import AdminCardHeader from '../card/AdminCardHeader.svelte';
    let { schedules, labs } = $props()
    let addScheduleModal: ReturnType<typeof AddClassScheduleModal> = $state(null as any)
</script>

<AdminCardHeader
    title="จัดการตารางเรียน"
    describe="ดูและจัดการตารางเรียนทั้งหมด"
    btnDetail="+ เพิ่มตารางเรียน"
    onButton={() => addScheduleModal.showModal()}
/>
<div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
        <div class="overflow-x-auto">
            {#snippet scheduleHeader()}
                <th>ห้อง</th>
                <th>วิชา</th>
                <th>วัน</th>
                <th>ช่วงเวลา</th>
                <th>จัดการ</th>
            {/snippet}

            {#snippet scheduleRow(s: any)}
                <td>{s.labs?.lab_name ?? s.lab_id}</td>
                <td>{s.subject}</td>
                <td>{DAY_NAMES[s.day_of_week]}</td>
                <td><span class="badge badge-sm">{mapSlotToDurationTime(s.slot)}</span></td>
                <td>
                    <form
                        method="POST"
                        action="?/deleteClassSchedule"
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update()
                                await invalidateAll()
                            }
                        }}
                    >
                        <input type="hidden" name="classId" value={s.class_id} />
                        <button type="submit" class="btn btn-xs btn-error btn-outline">ลบ</button>
                    </form>
                </td>
            {/snippet}

            <Table data={schedules} header={scheduleHeader} row={scheduleRow} />
        </div>
    </div>
</div>

<AddClassScheduleModal
    bind:this={addScheduleModal}
    {labs}
    {schedules}
/>