<script lang="ts">
    import '../../app.css';
    import { onMount } from 'svelte';
    import { Calendar, Clock, Users, AlertCircle, X, Check, LogOut } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    import type { 
        Session,
        BackendReservation,
        CurrentReservation,
        ReservationStatus,
        CheckReservationResponse,
        ReservationHistoryResponse,
        ReservationActionResponse
    } from '$lib/shared/types';
    import NavBar from '$lib/components/NavBar.svelte';
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
    
    export let data: { 
        session?: Session;
    };
    
    let currentReservation: CurrentReservation | null = null;
    let reservationHistory: BackendReservation[] = [];
    let loading = true;
    let error = '';
    let cancelLoading = false;
    let checkinLoading = false;
    let checkoutLoading = false;
    
    $: session = data.session;
    
    $: userId = (() => {
        const studentId = session?.user?.student_id;
        if (studentId && typeof studentId === 'string') {
            const parsed = parseInt(studentId, 10);
            return isNaN(parsed) ? 1 : parsed;
        }
        return 1;
    })();
    
    onMount(async () => {
        if (!session) {
            goto('/auth');
        }
        await loadReservations();
    });

    $: if (!session && browser) {
        window.location.href = '/auth';
    }
    
    async function loadReservations() {
        loading = true;
        error = '';
        
        try {
            // ใช้ endpoint ทั่วไป (ไม่ระบุ table_id, slot_id) สำหรับหน้า My Reservation
            const currentRes = await fetch(`${BACKEND_URL}/reservation_service/check/${userId}/reservation`);
            const currentData: CheckReservationResponse = await currentRes.json();
            
            if (currentData.success && currentData.status && currentData.tableReservation) {
                const reservation = currentData.tableReservation;
                currentReservation = {
                    ...reservation,
                    canCancel: ['PENDING', 'CONFIRMED'].includes(reservation.status),
                    canCheckin: ['PENDING', 'CONFIRMED'].includes(reservation.status),
                    canCheckout: reservation.status === 'CHECKED_IN'
                };
            } else {
                currentReservation = null;
            }

            // console.log('Current Reservation:', currentReservation);
            // console.log('THIS IS RESERVATION DATE: ' + currentReservation?.timeslot.start_at + ' ' + currentReservation?.timeslot.end_at);
            
            const historyRes = await fetch(`${BACKEND_URL}/reservation_service/user/${userId}/reservations/history`);
            const historyData: ReservationHistoryResponse = await historyRes.json();
            
            if (historyData.success) {
                reservationHistory = historyData.reservations || [];
            }
            
        } catch (err) {
            error = 'ไม่สามารถโหลดข้อมูลได้';
            console.error('Error loading reservations:', err);
        } finally {
            loading = false;
        }
    }
    
    async function cancelReservation(reservationId: number) {
        if (!confirm('คุณต้องการยกเลิกการจองนี้หรือไม่?')) return;
        
        cancelLoading = true;
        try {
            const res = await fetch(`${BACKEND_URL}/reservation_service/reservation/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservation_id: reservationId,
                    user_id: userId
                })
            });
            
            const data: ReservationActionResponse = await res.json();
            
            if (data.success) {
                alert('ยกเลิกการจองสำเร็จ');
                await loadReservations();
            } else {
                alert(data.error_th || data.error || 'ยกเลิกการจองไม่สำเร็จ');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            console.error('Error cancelling reservation:', err);
        } finally {
            cancelLoading = false;
        }
    }
    
    async function checkinReservation(reservationId: number) {
        if (!confirm('คุณต้องการเช็คอินเข้าใช้งานหรือไม่?')) return;
        
        checkinLoading = true;
        try {
            const res = await fetch(`${BACKEND_URL}/reservation_service/reservation/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservation_id: reservationId,
                    user_id: userId
                })
            });
            
            const data: ReservationActionResponse = await res.json();
            
            if (data.success) {
                alert('Check-in สำเร็จ');
                await loadReservations();
            } else {
                alert(data.error_th || data.error || 'Check-in ไม่สำเร็จ');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            console.error('Error checking in:', err);
        } finally {
            checkinLoading = false;
        }
    }

    async function checkoutReservation(reservationId: number) {
        if (!confirm('คุณต้องการเช็คเอาต์ออกจากระบบหรือไม่?')) return;
        
        checkoutLoading = true;
        try {
            const res = await fetch(`${BACKEND_URL}/reservation_service/reservation/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservation_id: reservationId,
                    user_id: userId
                })
            });
            
            const data: ReservationActionResponse = await res.json();
            
            if (data.success) {
                alert('Check-out สำเร็จ');
                await loadReservations();
            } else {
                alert(data.error_th || data.error || 'Check-out ไม่สำเร็จ');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            console.error('Error checking out:', err);
        } finally {
            checkoutLoading = false;
        }
    }
    
    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function formatTime(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    function getStatusBadge(status: ReservationStatus): { class: string; text: string } {
        const statusMap: Record<ReservationStatus, { class: string; text: string }> = {
            'PENDING': { class: 'badge-warning', text: 'รอการยืนยัน' },
            'CONFIRMED': { class: 'badge-info', text: 'ยืนยันแล้ว' },
            'CHECKED_IN': { class: 'badge-success', text: 'เช็คอินแล้ว' },
            'CHECKED_OUT': { class: 'badge-neutral', text: 'เช็คเอาต์แล้ว' },
            'CANCELLED': { class: 'badge-error', text: 'ยกเลิกแล้ว' },
            'AUTO_CANCELLED': { class: 'badge-error', text: 'ยกเลิกอัตโนมัติ' },
            'EXPIRED': { class: 'badge-ghost', text: 'หมดอายุ' }
        };
        return statusMap[status];
    }
    
    function getReservationNumber(id: number): string {
        return `#${id.toString().padStart(2, '0')}`;
    }
    
    function formatTableInfo(tableId: number, capacity: number): string {
        return `#${tableId} (${capacity} seats)`;
    }
</script>

<NavBar session={session} />

<div class="min-h-screen bg-base-200 py-8 px-4">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center text-base-content">การจองของฉัน</h1>
        
        {#if loading}
            <div class="flex justify-center items-center py-20">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        {:else if error}
            <div class="alert alert-error shadow-lg">
                <AlertCircle class="w-6 h-6" />
                <span>{error}</span>
            </div>
        {:else}
            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Left Column: Current Reservation -->
                <div>
                    {#if currentReservation}
                        <div class="card bg-base-100 shadow-xl">
                            <div class="card-body">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="card-title text-2xl text-base-content">การจองปัจจุบัน</h3>
                                    <div class="badge {getStatusBadge(currentReservation.status).class} badge-lg">
                                        {getStatusBadge(currentReservation.status).text}
                                    </div>
                                </div>
                                
                                <div class="bg-base-200 rounded-lg p-6 shadow-md">
                                    <div class="flex items-center gap-2 mb-4">
                                        <span class="text-3xl font-bold text-base-content">{getReservationNumber(currentReservation.reservation_id)}</span>
                                        <span class="badge badge-lg {getStatusBadge(currentReservation.status).class}">
                                            {getStatusBadge(currentReservation.status).text}
                                        </span>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div class="flex items-start gap-3">
                                            <Calendar class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                            <div class="flex-1">
                                                <p class="font-semibold text-base-content">ข้อมูลการจอง</p>
                                                <p class="text-sm text-base-content/70">
                                                    ผู้จอง: {session?.user?.name || 'ผู้ใช้'}
                                                </p>
                                                <p class="text-sm text-base-content/70">
                                                    โต๊ะ: {currentReservation.reservationtable
                                                        .map(rt => formatTableInfo(rt.table_id, rt.Table.capacity))
                                                        .join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div class="divider my-2"></div>
                                        
                                        <div class="flex items-start gap-3">    
                                            <Users class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                            <div class="flex-1">
                                                <p class="text-sm text-base-content/70">
                                                    จำนวนคน: <span class="font-semibold text-base-content">{currentReservation.party_size} คน</span>
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div class="divider my-2"></div>
                                        
                                        <div class="flex items-start gap-3">
                                            <Clock class="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                            <div class="flex-1">
                                                <p class="text-sm text-base-content/70">
                                                    เวลา: <span class="font-semibold text-base-content">{currentReservation.timeslot?.start_at} - {currentReservation.timeslot?.end_at}</span>
                                                    <!-- const currentRes = await fetch(`${BACKEND_URL}/reservation_service/check/${userId}/reservation`); -->
                                                    <!-- const currentData: CheckReservationResponse = await currentRes.json(); -->
                                                    <!-- const reservation = currentData.tableReservation; -->
                                                    <!-- currentReservation = {
                                                        ...reservation,
                                                        canCancel: ['PENDING', 'CONFIRMED'].includes(reservation.status),
                                                        canCheckin: ['PENDING', 'CONFIRMED'].includes(reservation.status),
                                                        canCheckout: reservation.status === 'CHECKED_IN'
                                                    }; -->
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div class="divider my-2"></div>
                                        
                                        <div class="text-sm text-base-content/60">
                                            รหัสนักศึกษา: {session?.user?.student_id || '66050999'}
                                        </div>
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="mt-6 flex flex-col gap-2">
                                        {#if currentReservation.canCheckin}
                                            <button 
                                                class="btn bg-secondary-qss text-white w-full"
                                                on:click={() => {
                                                    if (currentReservation) {
                                                        checkinReservation(currentReservation.reservation_id);
                                                    }
                                                }}
                                                disabled={checkinLoading}
                                            >
                                                {#if checkinLoading}
                                                    <span class="loading loading-spinner loading-sm"></span>
                                                {:else}
                                                    <Check class="w-4 h-4" />
                                                {/if}
                                                เช็คอิน
                                            </button>
                                        {/if}
                                        
                                        {#if currentReservation.canCheckout}
                                            <button 
                                                class="btn bg-black text-white w-full"
                                                on:click={() => {
                                                    if (currentReservation) {
                                                        checkoutReservation(currentReservation.reservation_id);
                                                    }
                                                }}
                                                disabled={checkoutLoading}
                                            >
                                                {#if checkoutLoading}
                                                    <span class="loading loading-spinner loading-sm"></span>
                                                {:else}
                                                    <LogOut class="w-4 h-4" />
                                                {/if}
                                                เช็คเอาต์
                                            </button>
                                        {/if}
                                        
                                        {#if currentReservation.canCancel}
                                            <button 
                                                class="btn bg-primary-qss text-white w-full"
                                                on:click={() => {
                                                    if (currentReservation) {
                                                        cancelReservation(currentReservation.reservation_id);
                                                    }
                                                }}
                                                disabled={cancelLoading}
                                            >
                                                {#if cancelLoading}
                                                    <span class="loading loading-spinner loading-sm"></span>
                                                {:else}
                                                    <X class="w-4 h-4" />
                                                {/if}
                                                ยกเลิกการจอง
                                            </button>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="card bg-base-100 shadow-xl">
                            <div class="card-body items-center text-center">
                                <AlertCircle class="w-16 h-16 text-base-content/40 mb-4" />
                                <p class="text-base-content/70">ไม่มีการจองในขณะนี้</p>
                                <a href="/" class="btn bg-accent-qss text-white mt-4">จองโต๊ะ</a>
                            </div>
                        </div>
                    {/if}
                </div>
                
                <!-- Right Column: Reservation History -->
                <div>                    
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h3 class="card-title text-xl text-base-content mb-4">ประวัติการจอง</h3>
                            
                            {#if reservationHistory.length === 0}
                                <div class="text-center py-12">
                                    <AlertCircle class="w-12 h-12 text-base-content/40 mx-auto mb-3" />
                                    <p class="text-base-content/70">ไม่มีประวัติการจอง</p>
                                </div>
                            {:else}
                                <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {#each reservationHistory as reservation}
                                        <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div class="card-body p-4">
                                                <div class="flex items-center justify-between mb-2">
                                                    <div class="flex items-center gap-2 flex-wrap">
                                                        <span class="badge badge-neutral font-semibold">{getReservationNumber(reservation.reservation_id)}</span>
                                                        <span class="text-sm text-base-content/70">
                                                            รอบ {reservation.timeslot?.start_at}
                                                        </span>
                                                        <span class="text-sm font-semibold text-base-content">
                                                            {reservation.timeslot?.start_at} - {reservation.timeslot?.end_at}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-2 flex-wrap">
                                                        <span class="badge {getStatusBadge(reservation.status).class}">
                                                            {getStatusBadge(reservation.status).text}
                                                        </span>
                                                        <span class="text-sm text-base-content/70">
                                                            {session?.user?.student_id || '66050123'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div class="mt-2 text-xs text-base-content/60">
                                                    โต๊ะ: {reservation.reservationtable.map(rt => `#${rt.table_id}`).join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Custom scrollbar with theme support */
    .overflow-y-auto::-webkit-scrollbar {
        width: 8px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-track {
        background: oklch(var(--b2));
        border-radius: 4px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb {
        background: oklch(var(--bc) / 0.3);
        border-radius: 4px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: oklch(var(--bc) / 0.5);
    }
</style>