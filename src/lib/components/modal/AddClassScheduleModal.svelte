<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidateAll } from '$app/navigation'
    import ModalBox from './ModalBox.svelte'

    let { labs, schedules } = $props()

    let dialogElement: HTMLDialogElement
    let newSchedule = $state({ labId: '', day_of_week: '', slot: '', subject: '' })
    let addError = $state('')

    export const showModal = () => {
        newSchedule = { labId: '', day_of_week: '', slot: '', subject: '' }
        addError = ''
        dialogElement.showModal()
    }

    const isDuplicate = () => schedules.some((s: any) =>
        s.lab_id === Number(newSchedule.labId) &&
        s.day_of_week === Number(newSchedule.day_of_week) &&
        s.slot === newSchedule.slot
    )
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">
    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">เพิ่มตารางเรียน</h3>
    {/snippet}

    {#snippet modalBoxContent()}
        {#if addError}
            <div class="alert alert-error mb-3">
                <span class="text-sm">{addError}</span>
            </div>
        {/if}

        <form
            id="add-schedule-form"
            method="POST"
            action="?/addClassSchedule"
            use:enhance={() => {
                addError = ''
                if (isDuplicate()) {
                    addError = 'ตารางเรียนนี้มีอยู่แล้ว'
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
                <select name="labId" class="select select-bordered select-sm w-full" bind:value={newSchedule.labId}>
                    <option disabled selected value="">เลือกห้อง</option>
                    {#each labs as lab}
                        <option value={lab.lab_id}>{lab.lab_name}</option>
                    {/each}
                </select>
                <input type="text" name="subject" placeholder="ชื่อวิชา" class="input input-bordered input-sm w-full" bind:value={newSchedule.subject}>
                <select name="day_of_week" class="select select-bordered select-sm w-full" bind:value={newSchedule.day_of_week}>
                    <option disabled selected value="">วันในสัปดาห์</option>
                    <option value="1">จันทร์</option>
                    <option value="2">อังคาร</option>
                    <option value="3">พุธ</option>
                    <option value="4">พฤหัสบดี</option>
                    <option value="5">ศุกร์</option>
                    <option value="6">เสาร์</option>
                </select>
                <select name="slot" class="select select-bordered select-sm w-full" bind:value={newSchedule.slot}>
                    <option disabled selected value="">ช่วงเวลา</option>
                    <option value="Morning">Morning (09:00-12:00)</option>
                    <option value="Lunch">Lunch (12:00-13:00)</option>
                    <option value="Afternoon">Afternoon (13:00-16:00)</option>
                </select>
            </div>
        </form>
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => dialogElement.close()}>ยกเลิก</button>
        <button type="submit" form="add-schedule-form" class="btn btn-primary btn-sm">บันทึก</button>
    {/snippet}

    <ModalBox
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
    />
</dialog>