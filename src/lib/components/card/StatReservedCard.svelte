<script lang="ts">
    let { bookingStats } = $props();
</script>

<div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
    <div class="stat place-items-center">
        <div class="stat-title">จำนวนการจองตั้งแต่วันนี้</div>
        <div class="stat-value text-primary">{ bookingStats.userUpcoming }</div>
        <div class="stat-desc">รายการ</div>
    </div>
    <div class="stat place-items-center">
        <div class="stat-title">จำนวนการจองทั้งหมด</div>
        <div class="stat-value text-secondary">{ bookingStats.userTotal }</div>
        <div class="stat-desc">รายการ</div>
    </div>
    <div class="stat place-items-center">
        <div class="stat-title">คุณได้ทำการจอง</div>
        <div class="stat-value">{ bookingStats.percentage.toFixed(2) }%</div>
        <div class="stat-desc">ของจำนวนการจองโต๊ะของสมาชิกทั้งหมด</div>
    </div>
</div>