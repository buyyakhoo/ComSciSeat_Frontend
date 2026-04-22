<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import ModalBox from './ModalBox.svelte'

    let { labs } = $props()

    let dialogElement: HTMLDialogElement
    let newLab = $state({ lab_name: '', lab_code: '' })
    let addError = $state('')

    export const showModal = () => {
        newLab = { lab_name: '', lab_code: '' }
        addError = ''
        dialogElement.showModal()
    }

    const isDuplicate = () => labs.some((l: any) =>
        l.lab_name.toLowerCase() === newLab.lab_name.toLowerCase()
    )
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">
    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">เพิ่มห้องแลป</h3>
    {/snippet}

    {#snippet modalBoxContent()}
        {#if addError}
            <div class="alert alert-error mb-3">
                <span class="text-sm">{addError}</span>
            </div>
        {/if}

        <form
            id="add-lab-form"
            method="POST"
            action="?/addLab"
            use:enhance={() => {
                addError = ''
                if (isDuplicate()) {
                    addError = 'ห้องแลปนี้มีอยู่แล้ว'
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
                <input
                    type="text"
                    name="lab_name"
                    placeholder="ชื่อห้องแลป เช่น Lab 1"
                    class="input input-bordered input-sm w-full"
                    bind:value={newLab.lab_name}
                />
                <input
                    type="text"
                    name="lab_code"
                    placeholder="รหัสห้องแลป เช่น L001"
                    class="input input-bordered input-sm w-full"
                    bind:value={newLab.lab_code}
                />
            </div>
        </form>
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => dialogElement.close()}>ยกเลิก</button>
        <button type="submit" form="add-lab-form" class="btn btn-primary btn-sm">บันทึก</button>
    {/snippet}

    <ModalBox
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
    />
</dialog>