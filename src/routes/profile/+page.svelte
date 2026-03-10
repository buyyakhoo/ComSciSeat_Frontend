<script lang="ts">
    import '../../app.css';
    import { Bell, User as UserIcon } from 'lucide-svelte';
    import NavBar from '$lib/components/web_layout/NavBar.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let session = $derived(data.session);
</script>

<svelte:head>
    <title>โปรไฟล์ - ComSciSeat</title>
</svelte:head>

<NavBar {session} />

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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                                {session?.user?.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-center">
            <a href="/" class="btn btn-ghost gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับสู่หน้าหลัก
            </a>
        </div>
    </div>
</div>