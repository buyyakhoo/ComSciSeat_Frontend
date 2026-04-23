<script lang="ts">
    import { Home, Calendar, Moon, Sun, User, LogOut, ShieldUser, Menu } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { UserStu as UserData } from '$lib/shared/types/usermode';
    
    let { session } = $props<{ session?: { user?: UserData } | null }>();
    let currentTheme: string = $state('light');
    let user = $derived(session?.user);
    const defaultProfileImage = '/images/default-profile.svg';
    
    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    });

    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function handleProfileImageError(event: Event) {
        const image = event.currentTarget as HTMLImageElement;
        if (image.src.endsWith(defaultProfileImage)) return;
        image.src = defaultProfileImage;
    }
</script>

<div class="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
    <div class="navbar-start">
        <!-- Hamburger Menu: Phone/Tablet -->
        <div class="dropdown lg:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <Menu class="h-5 w-5" />
            </div>
            <ul class="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href="/" class="text-base-content"><Home class="w-4 h-4" />Homepage</a></li>
                <li><a href="/reservation" class="text-base-content"><Calendar class="w-4 h-4" />Reservation</a></li>
                {#if user?.role === 'admin'}
                    <li><a href="/admin" class="text-base-content"><ShieldUser class="w-4 h-4" />Admin</a></li>
                {/if}
            </ul>
        </div>
        
        <a href="/" class="btn btn-ghost text-xl font-bold">🖥️ ComSciSeat</a>
    </div>
    
    <!-- Desktop Menu -->
    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
            <li><a href="/" class="active"><Home class="w-4 h-4" />Homepage</a></li>
            <li><a href="/reservation"><Calendar class="w-4 h-4" />Reservation</a></li>
            {#if user?.role === 'admin'}
                <li><a href="/admin"><ShieldUser class="w-4 h-4" />Admin</a></li>
            {/if}
        </ul>
    </div>
    
    <div class="navbar-end gap-2">
        <button class="btn btn-ghost btn-circle" onclick={toggleTheme}>
            {#if currentTheme === 'light'}<Moon class="w-5 h-5" />{:else}<Sun class="w-5 h-5" />{/if}
        </button>
        
        {#if user}
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img
                            alt="Profile"
                            src={user.image || defaultProfileImage}
                            onerror={handleProfileImageError}
                        />
                    </div>
                </div>
                <ul class="mt-3 z-50 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 gap-2">
                    <li class="menu-title">
                        <span class="text-base-content">{user.name || 'ผู้ใช้'}</span>
                        <span class="text-xs opacity-60">{user.role || 'นักศึกษา'}</span>
                    </li>
                    <li><a href="/profile" class="text-base-content"><User class="w-4 h-4" />Profile</a></li>
                    <li>
                        <button onclick={toggleTheme} class="text-base-content">
                            {#if currentTheme === 'light'}<Moon class="w-4 h-4" />Dark Mode{:else}<Sun class="w-4 h-4" />Light Mode{/if}
                        </button>
                    </li>
                    <li>
                        <a href="/signout" class="text-error">
                            <LogOut class="w-4 h-4" />Sign Out
                        </a>
                    </li>
                </ul>
            </div>
        {:else}
            <a href="/auth" class="btn btn-ghost btn-sm">
                <LogOut class="w-4 h-4" />
                เข้าสู่ระบบ
            </a>
        {/if}
    </div>
</div>
