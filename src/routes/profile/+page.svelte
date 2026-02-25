<script lang="ts">
    import '../../app.css';
    import { Bell, User as UserIcon } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import NavBar from '$lib/components/initial/NavBar.svelte';
    
    import type { Session } from '$lib/shared/types';

    let data = $props<{ 
        session?: Session;
        profileData?: any;
        error?: string | null;
    }>();

    let session = $derived(data.session);
    let profileData = $derived(data.profileData);
    let error = $derived(data.error || '');

    let isLoading = false;

    // Redirect to auth if no session
    onMount(() => {
        if (!session) {
            goto('/auth');
        } else {
            isLoading = true;
        }
    });

    // $effect(() => {
    //     if (!session && browser) {
    //         window.location.href = '/auth';
    //     }
    // });
</script>

<svelte:head>
    <title>โปรไฟล์ - ComSciSeat</title>
</svelte:head>

<!-- Session Check -->
{#if !session}
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="text-center">
            <div class="loading loading-spinner loading-lg mb-4"></div>
            <p>กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
        </div>
    </div>
{:else}

<NavBar {session} />

<!-- Content -->
<div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-8 max-w-md">
        
        <!-- Profile Card -->
        <div class="card bg-base-100 shadow-2xl">
            <div class="card-body">
                
                <!-- Header with Bell Icon -->
                <div class="flex justify-end -mt-2 -mr-2">
                    <button class="btn btn-ghost btn-circle btn-sm">
                        <Bell class="w-5 h-5" />
                    </button>
                </div>

                {#if isLoading}
                    <!-- Loading State -->
                    <div class="flex flex-col items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg text-primary"></span>
                        <p class="text-base-content/70 mt-4">กำลังโหลดข้อมูล...</p>
                    </div>
                {:else if error}
                    <!-- Error State -->
                    <div class="alert alert-error shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                    <div class="card-actions justify-center mt-4">
                        <a href="/profile" class="btn btn-primary btn-sm" data-sveltekit-reload>
                            ลองอีกครั้ง
                        </a>
                    </div>
                {:else if profileData}
                    <!-- Profile Avatar -->
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

                    <!-- Profile Information -->
                    <div class="space-y-3 card-body items-center">
                        
                        <!-- Name Field -->
                        <div class="form-control w-full">
                            <label class="label" for="nameInput">
                                <span class="label-text font-semibold">Name</span>
                            </label>
                            <div class="input input-bordered flex items-center bg-base-200">
                                <span class="font-medium">{profileData.name}</span>
                            </div>
                        </div>

                        <!-- ID Field -->
                        <div class="form-control w-full">
                            <label class="label" for="idInput">
                                <span class="label-text font-semibold">ID</span>
                            </label>
                            <div class="input input-bordered flex items-center bg-base-200">
                                <span class="font-medium">{profileData.user_id}</span>
                            </div>
                        </div>

                        <!-- Email Field -->
                        <div class="form-control w-full">
                            <label class="label" for="emailInput">
                                <span class="label-text font-semibold">E-Mail</span>
                            </label>
                            <div class="input input-bordered flex items-center bg-base-200">
                                <span class="font-medium">{profileData.email}</span>
                            </div>
                        </div>

                        <!-- Role Badge -->
                        <div class="form-control w-full">
                            <label class="label" for="roleInput">
                                <span class="label-text font-semibold">Role</span>
                            </label>
                            <div class="flex items-center">
                                <div class="badge bg-[var(--color-accent-qss)] text-white badge-lg gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                    {profileData.user_type}
                                </div>
                            </div>
                        </div>

                    </div>
                {/if}

            </div>
        </div>

        <!-- Back to Home Button -->
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

{/if}