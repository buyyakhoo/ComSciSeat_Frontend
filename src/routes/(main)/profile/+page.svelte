<script lang="ts">
    import { User as UserIcon, BadgeCheck, ArrowLeft } from 'lucide-svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let session = $derived(data.session);
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
                            {#if session?.user?.image}
                                <img src={session.user.image} alt="Profile" />
                            {:else}
                                <div class="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                                    <UserIcon class="w-12 h-12" />
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="space-y-3 card-body items-center">
                    <div class="form-control w-full">
                        <label class="label" for="nameInput">
                            <span class="label-text font-semibold">Name</span>
                        </label>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{session?.user?.name}</span>
                        </div>
                    </div>
                    <div class="form-control w-full">
                        <label class="label" for="idInput">
                            <span class="label-text font-semibold">ID</span>
                        </label>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{session?.user?.student_id}</span>
                        </div>
                    </div>
                    <div class="form-control w-full">
                        <label class="label" for="emailInput">
                            <span class="label-text font-semibold">E-Mail</span>
                        </label>
                        <div class="input input-bordered flex items-center bg-base-200">
                            <span class="font-medium">{session?.user?.email}</span>
                        </div>
                    </div>
                    <div class="form-control w-full">
                        <label class="label" for="roleInput">
                            <span class="label-text font-semibold">Role</span>
                        </label>
                        <div class="flex items-center">
                            <div class="badge bg-[var(--color-accent-qss)] text-white badge-lg gap-2">
                                <BadgeCheck class="inline-block w-4 h-4 stroke-current" />
                                {session?.user?.role}
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