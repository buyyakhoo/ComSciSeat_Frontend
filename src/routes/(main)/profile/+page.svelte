<script lang="ts">
    import { BadgeCheck, ArrowLeft } from 'lucide-svelte';
    import { formatStudentId } from '$lib/shared/utils';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let user = $derived(data.user);
    let displayStudentId = $derived(formatStudentId(user?.student_id));
    const fallbackImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face';
</script>

<svelte:head>
    <title>โปรไฟล์ - ComSciSeat</title>
</svelte:head>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-md">
        <div class="card bg-base-100 shadow-2xl">
            <div class="card-body">
                <div class="flex justify-center mb-6">
                    <div class="avatar online placeholder">
                        <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user?.image || fallbackImage} alt="Profile" />
                        </div>
                    </div>
                </div>

                <div class="space-y-3 card-body items-center">
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-semibold">Name</span>
                        </div>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{user?.name}</span>
                        </div>
                    </div>
                    {#if displayStudentId}
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-semibold">ID</span>
                        </div>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{displayStudentId}</span>
                        </div>
                    </div>
                    {/if}
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-semibold">E-Mail</span>
                        </div>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{user?.email}</span>
                        </div>
                    </div>
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-semibold">Role</span>
                        </div>
                        <div class="flex items-center">
                            <div class="badge bg-[var(--color-accent-qss)] text-white badge-lg gap-2">
                                <BadgeCheck class="inline-block w-4 h-4 stroke-current" />
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-center">
            <a href="/" class="btn btn-ghost gap-2">
                <ArrowLeft class="h-5 w-5" />
                กลับสู่หน้าหลัก
            </a>
        </div>
    </div>
</div>
