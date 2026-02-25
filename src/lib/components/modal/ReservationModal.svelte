<script lang="ts">
  import ModalBox from './ModalBox.svelte';

    let { onReservationSuccess } = $props();
    let dialogElement: HTMLDialogElement;

    let tableId: number = $state(0);
    let tableCode: string = $state('');
    let date: string = $state('');
    let slot: string = $state('');
    let isReserved: boolean = $state(false);

    export const showModal = (tableIdValue: number, tableCodeValue: string, dateValue: string, slotValue: string, isReservedValue: boolean) => {
        tableId = tableIdValue;
        tableCode = tableCodeValue;
        date = dateValue;
        slot = slotValue;
        isReserved = isReservedValue;
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
            <p><span class="font-semibold opacity-70">ช่วงเวลา (Slot):</span> { slot }</p>
        {/snippet}

        {#snippet modalBoxApprovedBtn()}
            <button class="btn btn-ghost">ย้อนกลับ</button>
            <button class="btn btn-primary" onclick={handleConfirm}> ยืนยันการจอง </button>
        {/snippet}

        <ModalBox 
            modalBoxHeader={modalBoxHeader}
            modalBoxContent={modalBoxContent}
            modalBoxBtn={modalBoxApprovedBtn}
        />
    {/if}
</dialog>