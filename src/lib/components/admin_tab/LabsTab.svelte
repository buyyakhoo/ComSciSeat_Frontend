<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import Table from '../table/Table.svelte'
    import AddLabModal from '../modal/AddLabModal.svelte'

    let { labs } = $props()
    let addLabModal: ReturnType<typeof AddLabModal> = $state(null as any)
</script>

<div class="mb-6 flex justify-between items-center">
    <div>
        <h1 class="text-2xl font-bold">จัดการห้องแลป</h1>
        <p class="text-base-content/50 text-sm mt-1">ห้องแลปทั้งหมดในระบบ</p>
    </div>
    <div class="flex gap-2 items-center">
        <div class="badge badge-outline">{labs.length} ห้อง</div>
        <button class="btn btn-primary btn-sm" onclick={() => addLabModal.showModal()}>
            + เพิ่มห้องแลป
        </button>
    </div>
</div>

<div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
        <div class="overflow-x-auto">
            {#snippet labHeader()}
                <th>ชื่อห้อง</th>
                <th>รหัสห้อง</th>
                <th>จัดการ</th>
            {/snippet}

            {#snippet labRow(lab: any)}
                <td class="font-mono font-bold">{lab.lab_name}</td>
                <td class="font-mono text-sm">{lab.lab_code || '-'}</td>
                <td>
                    <form method="POST" action="?/deleteLab"
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update()
                                await invalidateAll()
                            }
                        }}
                    >
                        <input type="hidden" name="labId" value={lab.lab_id} />
                        <button type="submit" class="btn btn-xs btn-error btn-outline">ลบ</button>
                    </form>
                </td>
            {/snippet}

            <Table data={labs} header={labHeader} row={labRow} />
        </div>
    </div>
</div>

<AddLabModal bind:this={addLabModal} {labs} />