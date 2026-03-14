<script lang="ts">
    import { TriangleAlert, User, House } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    $effect(() => {
        if ($page.data.session?.user?.role === 'admin') {
            goto('/admin');
        }
    });
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl border border-error/30">
        <div class="card-body items-center text-center gap-4">

            <div class="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
                <TriangleAlert class="w-10 h-10 text-error" />
            </div>

            <div>
                <h1 class="text-2xl font-bold text-error">ไม่มีสิทธิ์เข้าถึง</h1>
                <p class="text-base-content/60 text-sm mt-1">Access Denied — Admin Only</p>
            </div>

            <div class="divider my-0"></div>

            <p class="text-base-content/70 text-sm leading-relaxed">
                หน้านี้สำหรับผู้ดูแลระบบเท่านั้น<br>
                หากคิดว่านี่คือข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ
            </p>

            <div class="badge badge-error badge-outline gap-1 py-3">
                <User class="w-3 h-3" />
                บัญชีของคุณไม่ใช่ระดับ Admin
            </div>

            <div class="card-actions w-full flex-col gap-2 mt-2">
                <a href="/" class="btn btn-error w-full">
                    <House class="w-4 h-4" />
                    กลับหน้าหลัก
                </a>
            </div>

        </div>
    </div>
</div>