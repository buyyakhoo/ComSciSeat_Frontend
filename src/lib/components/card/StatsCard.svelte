<script lang="ts">
    let { statsDescribe } = $props();
</script>

<div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
    {#each statsDescribe as stat}
        <div class="stat place-items-center">
            <div class="stat-title">{stat.title}</div>
            <div class="stat-value text-primary">{stat.value}</div>
            <div class="stat-desc">{stat.desc}</div>
        </div>
    {/each}
</div>