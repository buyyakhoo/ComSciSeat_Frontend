<script lang="ts">
    let { title, actionCenter, actionEnd } = $props();
</script>

<div class="card bg-base-100 shadow-md mb-4 sm:mb-6">
    <div class="card-body flex-col md:flex-row items-center justify-between">
        <div class="flex-col items-start">
            {@render title()}
        </div>

        {#if actionCenter}
            {@render actionCenter()}
        {/if}
        
        {@render actionEnd()}
    </div>
</div>