<script lang="ts">
    import type { AdminCardHeaderProps } from '$lib/shared/types/admin';
    let { title, describe, btnDetail, count, onButton }: AdminCardHeaderProps = $props();
    
</script>

<div class="mb-6 flex justify-between items-center">
    <div>
        <h1 class="text-2xl font-bold">{title}</h1>
        <p class="text-base-content/50 text-sm mt-1">{describe}</p>
    </div>
    {#if count !== undefined}
        <div class="badge badge-outline text-xs md:text-md p-2">{count} รายการ</div>
    {/if}
    <button class="btn btn-primary btn-sm" onclick={onButton}>
        {btnDetail}
    </button>
</div>