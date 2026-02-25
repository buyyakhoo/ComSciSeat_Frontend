<script lang="ts">
    let { modalBoxHeader, modalBoxContent, modalBoxBtn } = $props()
</script>

<div class="modal-box">
    <h3 class="text-2xl font-bold text-primary mb-4">
        {@render modalBoxHeader()}
    </h3>
    <div class="bg-base-200 p-4 rounded-xl flex flex-col gap-2 mb-2 text-base-content">
        {@render modalBoxContent()}
    </div>
    <div class="modal-action">
        <form method="dialog">
            {@render modalBoxBtn()}
        </form>
    </div>
</div>