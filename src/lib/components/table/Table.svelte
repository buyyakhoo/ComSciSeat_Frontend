<script lang="ts">
    let { data, header, row } = $props();
</script>

<table class="table">
    <thead>
        <tr>
            {@render header()}
        </tr>
    </thead>
    <tbody>
        {#each data as item}
            <tr>
                {@render row(item)}
            </tr>
        {/each}
    </tbody>
</table>