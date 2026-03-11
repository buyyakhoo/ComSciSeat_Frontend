<script lang="ts">
    interface Props {
        message?: string
    }
    let { message = 'กำลังโหลด...' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3 py-8">
    <span class="loading loading-spinner loading-lg text-primary"></span>
    <p class="text-base-content/70 text-sm">{message}</p>
</div>