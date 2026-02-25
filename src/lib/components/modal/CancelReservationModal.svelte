<script lang="ts">
  import ModalBox from './ModalBox.svelte';

    let { onReservationCancelSuccess } = $props();
    let dialogElement: HTMLDialogElement;
    let bookingId: number = $state(0);
    let tableId: number = $state(0);
    let tableCode: string = $state('');
    let date: string = $state('');
    let slot: string = $state('');

    export const showModal = (bookingIdValue: number, tableIdValue: number, tableCodeValue: string, dateValue: string, slotValue: string) => {
        dialogElement.showModal();
        bookingId = bookingIdValue;
        tableId = tableIdValue;
        tableCode = tableCodeValue;
        date = dateValue;
        slot = slotValue;
    }
    
    const handleConfirm = () => {
        if (onReservationCancelSuccess) {
            onReservationCancelSuccess(bookingId);
        }
        dialogElement.close();
    }
    
</script>

<dialog bind:this={dialogElement} class="modal modal-bottom sm:modal-middle">

    {#snippet modalBoxHeader()}
        <h3 class="text-2xl font-bold text-primary mb-4">
            ยืนยันการยกเลิกการจองโต๊ะ
        </h3>
    {/snippet}

    {#snippet modalBoxContent()}
        <p><span class="font-semibold opacity-70">โต๊ะ (Table Code):</span> { tableCode }</p>
        <p><span class="font-semibold opacity-70">วันที่จอง (Date):</span> { date.slice(0, 10) }</p>
        <p><span class="font-semibold opacity-70">ช่วงเวลา (Slot):</span> { slot }</p>
    {/snippet}

    {#snippet modalBoxApprovedBtn()}
        <button class="btn btn-ghost">ย้อนกลับ</button>
        <button class="btn btn-primary" onclick={handleConfirm}>
            ยืนยันยกเลิกการจองโต๊ะ
        </button>
    {/snippet}

    <ModalBox 
        modalBoxHeader={modalBoxHeader}
        modalBoxContent={modalBoxContent}
        modalBoxBtn={modalBoxApprovedBtn}
    />
</dialog>