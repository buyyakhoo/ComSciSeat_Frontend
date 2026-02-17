<script lang="ts">
    // import type { TableStats, Table } from '$lib/shared/types';

    export let stats: TableStats;
    export let tables: Table[];

</script>

<div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
    <div class="stat place-items-center">
        <div class="stat-title">โต๊ะว่าง</div>
        <div class="stat-value text-accent-qss">{stats.available}</div>
        <div class="stat-desc">พร้อมใช้งาน</div>
    </div>
    <div class="stat place-items-center">
        <div class="stat-title">โต๊ะที่จอง</div>
        <div class="stat-value text-secondary-qss">{stats.reserved}</div>
        <div class="stat-desc">รอ check-in</div>
    </div>
    <!-- <div class="stat place-items-center">
        <div class="stat-title">โต๊ะทั้งหมด</div>
        <div class="stat-value text-accent-qss">{tables.length}</div>
        <div class="stat-desc">รายการ</div>
    </div> -->
</div>