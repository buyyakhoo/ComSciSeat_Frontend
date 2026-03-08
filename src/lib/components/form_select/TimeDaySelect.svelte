<script lang="ts">
    import { enhance } from '$app/forms'; 
    let { getTodayDate, isSlotDisabled, labData, onResult } = $props();
</script>

<form 
    method="POST" 
    action="?/checkAvailability"
    use:enhance={() => {
        return async ({ result }: { result: any }) => {
            onResult?.(result);
        };
    }}
>

    <fieldset class="fieldset m-auto bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">เลือกเวลาที่ต้องการจอง</legend>

        <label class="label" for="dateInput">วันที่</label>
        <input name="date" id="dateInput" type="date" class="input" min={getTodayDate()} bind:value={labData.selectedDate} />

        <label class="label" for="timeInput">เวลา</label>
        <select name="slot" id="timeInput" class="select" bind:value={labData.selectedTime}>
            <option disabled selected>เลือกเวลา</option>
            <option value="Morning" disabled={isSlotDisabled('Morning', labData.selectedDate)}>09:00 - 12:00</option>
            <option value="Lunch" disabled={isSlotDisabled('Lunch', labData.selectedDate)}>12:00 - 13:00</option>
            <option value="Afternoon" disabled={isSlotDisabled('Afternoon', labData.selectedDate)}>13:00 - 16:00</option>
        </select>

        <input type="hidden" name="lab_id" value={labData.roomId} />

        <button class="btn btn-neutral mt-4" type="submit">เลือกเวลา</button>
    </fieldset> 
</form>