<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import AddTableModal from '../modal/AddTableModal.svelte'
    import Table from '../table/Table.svelte'

    let { tables, labs } = $props()
    let selectedLab = $state('all')
    let filteredTables = $derived(
        selectedLab === 'all' ? tables : tables.filter((t: any) => t.lab_id === Number(selectedLab))
    )

    let addTableModal: ReturnType<typeof AddTableModal> = $state(null as any)
</script>

<div class="mb-6 flex justify-between items-center">
    <div>
        <h1 class="text-2xl font-bold">จัดการโต๊ะ</h1>
        <p class="text-base-content/50 text-sm mt-1">โต๊ะทั้งหมดในแต่ละห้องแลป</p>
    </div>
    <div class="flex gap-2 items-center">
        <div class="badge badge-outline">{tables.length} โต๊ะ</div>
        <button class="btn btn-primary btn-sm" onclick={() => addTableModal.showModal()}>
            + เพิ่มโต๊ะ
        </button>
    </div>
</div>

<div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
        <select class="select select-sm select-bordered w-fit mb-4" bind:value={selectedLab}>
            <option value="all">ทุกห้อง</option>
            {#each labs as lab}
                <option value={lab.lab_id}>{lab.lab_name}</option>
            {/each}
        </select>
        <div class="overflow-x-auto">
            {#snippet tableHeader()}
                <th>รหัสโต๊ะ</th>
                <th>ห้องแลป</th>
                <th>จัดการ</th>
            {/snippet}
            {#snippet tableRow(t: any)}
                <td class="font-mono font-bold">{t.table_code}</td>
                <td>{t.labs?.lab_name ?? t.lab_id}</td>
                <td>
                    <form method="POST" action="?/deleteTable"
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update()
                                await invalidateAll()
                            }
                        }}
                    >
                        <input type="hidden" name="tableId" value={t.table_id} />
                        <button type="submit" class="btn btn-xs btn-error btn-outline">ลบ</button>
                    </form>
                </td>
            {/snippet}
            <Table data={filteredTables} header={tableHeader} row={tableRow} />
        </div>
    </div>
</div>

<AddTableModal bind:this={addTableModal} {labs} {tables} />