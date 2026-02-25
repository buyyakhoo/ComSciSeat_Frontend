<script lang="ts">
    let { onReservationSuccess } = $props();
    let dialogElement: HTMLDialogElement;

    let tableId: number = $state(0);
    let tableCode: string = $state('');
    let date: string = $state('');
    let slot: string = $state('');

    export const showModal = (tableIdValue: number, tableCodeValue: string, dateValue: string, slotValue: string) => {
        tableId = tableIdValue;
        tableCode = tableCodeValue;
        date = dateValue;
        slot = slotValue;
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
    <div class="modal-box">
        <h3 class="text-2xl font-bold text-primary mb-4">
            ยืนยันการจองโต๊ะ { tableCode }
        </h3>
        
        <div class="bg-base-200 p-4 rounded-xl flex flex-col gap-2 mb-2 text-base-content">
            <p><span class="font-semibold opacity-70">รหัสโต๊ะ (Table ID):</span> { tableId }</p>
            <p><span class="font-semibold opacity-70">วันที่จอง (Date):</span> { date }</p>
            <p><span class="font-semibold opacity-70">ช่วงเวลา (Slot):</span> { slot }</p>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-ghost">ย้อนกลับ</button>
            </form>
            <button class="btn btn-primary" onclick={handleConfirm}>
                ยืนยันการจอง
            </button>
        </div>
    </div>
</dialog>