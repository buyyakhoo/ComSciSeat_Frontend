<script lang="ts">
    let { stat } = $props()
</script>

<div class="card bg-base-100 border border-base-300 p-4 hover:-translate-y-1 transition-transform">
    <div class="text-base-content/50 text-xs font-mono mb-2">{stat.label}</div>
    <div class="text-3xl font-bold font-mono {stat.color}">{stat.value}</div>
    <div class="text-xs text-base-content/40 mt-1">{stat.sub}</div>
</div>