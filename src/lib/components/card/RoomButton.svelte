<script lang="ts">

    interface RoomButtonProps {
        allowed: boolean;
        code: string;
        describe?: string;
        allowedDisplay?: string;
        notAllowedDisplay?: string;
        onButton: () => void;
    }

    let { allowed, code, describe, allowedDisplay, notAllowedDisplay, onButton }: RoomButtonProps = $props(); 
</script>

<button
    onclick={() => onButton()}
    class="card w-full cursor-pointer shadow-lg
                {allowed ? 'bg-primary text-primary-content hover:scale-105 transition-transform duration-200' : 'bg-error opacity-50'}
    "
>
    <div class="card-body p-3 text-center">
        <div class="text-lg font-bold">#{code}</div>
        {#if describe}
            <div class="text-xs">{describe}</div>
        {/if}
        {#if allowedDisplay && notAllowedDisplay}
            <div class="badge badge-sm w-full mt-1">{allowed ? allowedDisplay : notAllowedDisplay}</div>
        {/if}
    </div>
</button>