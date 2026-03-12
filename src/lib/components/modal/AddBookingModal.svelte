<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import ModalBox from './ModalBox.svelte'

    let { labs, tables } = $props()

    let dialogElement: HTMLDialogElement
    let newBooking = $state({ userId: '', labId: '', tableId: '', booking_date: '', slot: '' })
    let addError = $state('')

    export const showModal = () => {
        newBooking = { userId: '', labId: '', tableId: '', booking_date: '', slot: '' }
        addError = ''
        dialogElement.showModal()
    }

    let filteredTables = $derived(
        newBooking.labId ? tables.filter((t: any) => t.lab_id === Number(newBooking.labId)) : []
    )
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">
    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">เพิ่มการจอง</h3>
    {/snippet}

    {#snippet modalBoxContent()}
        {#if addError}
            <div class="alert alert-error mb-3">
                <span class="text-sm">{addError}</span>
            </div>
        {/if}

        <form
            id="add-booking-form"
            method="POST"
            action="?/addBooking"
            use:enhance={() => {
                addError = ''
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
                    name="userId"
                    placeholder="รหัสนักศึกษา เช่น 65070001"
                    class="input input-bordered input-sm w-full"
                    bind:value={newBooking.userId}
                />
                <select
                    class="select select-bordered select-sm w-full"
                    bind:value={newBooking.labId}
                    onchange={() => newBooking.tableId = ''}
                >
                    <option disabled value="">เลือกห้องแลป</option>
                    {#each labs as lab}
                        <option value={lab.lab_id}>{lab.lab_name}</option>
                    {/each}
                </select>
                <select
                    name="tableId"
                    class="select select-bordered select-sm w-full"
                    bind:value={newBooking.tableId}
                    disabled={!newBooking.labId}
                >
                    <option disabled value="">เลือกโต๊ะ</option>
                    {#each filteredTables as table}
                        <option value={table.table_id}>{table.table_code}</option>
                    {/each}
                </select>
                <input
                    type="date"
                    name="booking_date"
                    class="input input-bordered input-sm w-full"
                    bind:value={newBooking.booking_date}
                />
                <select name="slot" class="select select-bordered select-sm w-full" bind:value={newBooking.slot}>
                    <option disabled value="">ช่วงเวลา</option>
                    <option value="Morning">Morning (09:00-12:00)</option>
                    <option value="Lunch">Lunch (12:00-13:00)</option>
                    <option value="Afternoon">Afternoon (13:00-16:00)</option>
                </select>
                <!-- hidden field สำหรับ userId -->
                <input type="hidden" name="userId" value={newBooking.userId} />
            </div>
        </form>
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => dialogElement.close()}>ยกเลิก</button>
        <button type="submit" form="add-booking-form" class="btn btn-primary btn-sm">บันทึก</button>
    {/snippet}

    <ModalBox
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
    />
</dialog>