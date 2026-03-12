<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import ModalBox from './ModalBox.svelte'

    let { labs, tables } = $props()

    let dialogElement: HTMLDialogElement
    let newTable = $state({ labId: '', table_code: '' })
    let addError = $state('')

    export const showModal = () => {
        newTable = { labId: '', table_code: '' }
        addError = ''
        dialogElement.showModal()
    }

    const isDuplicate = () => tables.some((t: any) =>
        t.lab_id === Number(newTable.labId) &&
        t.table_code === newTable.table_code
    )
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">
    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">เพิ่มโต๊ะ</h3>
    {/snippet}

    {#snippet modalBoxContent()}
        {#if addError}
            <div class="alert alert-error mb-3">
                <span class="text-sm">{addError}</span>
            </div>
        {/if}

        <form
            id="add-table-form"
            method="POST"
            action="?/addTable"
            use:enhance={() => {
                addError = ''
                if (isDuplicate()) {
                    addError = 'โต๊ะนี้มีอยู่แล้วในห้องนี้'
                    return ({ cancel }: any) => cancel()
                }
                return async ({ result, update }: any) => {
                    if (result.type === 'success') {
                        dialogElement.close()
                        await invalidateAll()
                    } else {
                        addError = result.data?.message ?? 'เพิ่มไม่สำเร็จ'
                    }
                    await update()
                }
            }}
        >
            <div class="flex flex-col gap-3">
                <select name="labId" class="select select-bordered select-sm w-full" bind:value={newTable.labId}>
                    <option disabled selected value="">เลือกห้องแลป</option>
                    {#each labs as lab}
                        <option value={lab.lab_id}>{lab.lab_name}</option>
                    {/each}
                </select>
                <input
                    type="text"
                    name="table_code"
                    placeholder="รหัสโต๊ะ เช่น A01"
                    class="input input-bordered input-sm w-full"
                    maxlength="3"
                    bind:value={newTable.table_code}
                />
            </div>
        </form>
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => dialogElement.close()}>ยกเลิก</button>
        <button type="submit" form="add-table-form" class="btn btn-primary btn-sm">บันทึก</button>
    {/snippet}

    <ModalBox
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
    />
</dialog>