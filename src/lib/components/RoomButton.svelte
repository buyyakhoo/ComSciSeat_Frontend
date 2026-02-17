<script lang="ts">
    import type { LabRoom } from '$lib/shared/types';
    import { createEventDispatcher } from 'svelte';
    export let labRoom: LabRoom;
    // const dispatch = createEventDispatcher<TableButtonEvents>();

    // const handleClick = () => {
    //     dispatch('click', { labRoom });
    // }   
</script>

<a
    href={`/lab_tables/${labRoom.lab_id}`}
    class="card bg-primary-qss text-neutral-content w-full cursor-pointer shadow-lg"
>
    <div class="card-body p-3 text-center">
        <div class="text-lg font-bold">#{labRoom.lab_id}</div>
        <div class="text-xs">{labRoom.lab_name}</div>
    </div>
</a>