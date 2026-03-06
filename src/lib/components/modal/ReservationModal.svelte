<script lang="ts">
    import { enhance } from '$app/forms';
    import ModalBox from './ModalBox.svelte';
    import { mapSlotToDurationTime } from '$lib/shared/utils';

    let { onReservationSuccess } = $props();
    let dialogElement: HTMLDialogElement;

    let tableId: number = $state(0);
    let tableCode: string = $state('');
    let date: string = $state('');
    let slot: string = $state('');
    let isReserved: boolean = $state(false);
    let labId: number = $state(0);

    export const showModal = (
            tableIdValue: number, 
            tableCodeValue: string, 
            dateValue: string, 
            slotValue: string, 
            isReservedValue: boolean, 
            labIdValue: number
    ) => {
        tableId = tableIdValue;
        tableCode = tableCodeValue;
        date = dateValue;
        slot = slotValue;
        isReserved = isReservedValue;
        labId = labIdValue;
        dialogElement.showModal();
    }
    
    const handleConfirm = () => {
        if (onReservationSuccess) {
            onReservationSuccess(tableId);
        }
        dialogElement.close();
    }
    
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">
    {#if isReserved}
        {#snippet modalBoxHeader()}
            <h3 class="text-2xl font-bold text-primary mb-4">
                คุณมีการจองโต๊ะในช่วงเวลานี้แล้ว 
            </h3>
        {/snippet}

        {#snippet modalBoxContent()}
            <p>กรุณายกเลิกการจองก่อนทำการจองใหม่</p>
        {/snippet}

        {#snippet modalBoxApprovedBtn()}
            <button class="btn btn-ghost">ย้อนกลับ</button>
        {/snippet}

        <ModalBox 
            modalBoxHeader={modalBoxHeader}
            modalBoxContent={modalBoxContent}
            modalBoxBtn={modalBoxApprovedBtn}
        />
    {:else}
        {#snippet modalBoxHeader()}
            <h3 class="text-2xl font-bold text-primary mb-4">
                ยืนยันการจองโต๊ะ
            </h3>
        {/snippet}

        {#snippet modalBoxContent()}
            <p><span class="font-semibold opacity-70">โต๊ะ (Table Code):</span> { tableCode }</p>
            <p><span class="font-semibold opacity-70">วันที่จอง (Date):</span> { date }</p>
            <p><span class="font-semibold opacity-70">ช่วงเวลา (Slot):</span> { mapSlotToDurationTime(slot) }</p>
        {/snippet}

        {#snippet modalBoxApprovedBtn()}
            <form
                method="POST"
                action="?/reserve"
                use:enhance={() => {
                    return async ({ result, update }: { result: any, update: (opts?: any) => Promise<void> }) => {
                        await update({ invalidateAll: false }); // ← เพิ่ม
                        dialogElement.close();
                        onReservationSuccess?.(result.data);
                    };
                }}
            >
                <button class="btn btn-ghost" onclick={() => dialogElement.close()}>ย้อนกลับ</button>
                <input type="hidden" name="table_id" value={tableId} />
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="slot" value={slot} />
                <input type="hidden" name="lab_id" value={labId} />
                <button type="submit" class="btn btn-primary">ยืนยันการจอง</button>
            </form>
        {/snippet}

        <ModalBox 
            modalBoxHeader={modalBoxHeader}
            modalBoxContent={modalBoxContent}
            modalBoxBtn={modalBoxApprovedBtn}
        />
    {/if}
</dialog>