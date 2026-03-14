<script lang="ts">
  import { Moon, Sun, Menu } from "lucide-svelte";
  import { onMount } from "svelte";

    let { activeTab } = $props();
    let currentTheme: string = $state('light');
    
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
</script>

<div class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6 sticky top-0 z-10">
    <div class="flex-none lg:hidden">
        <label for="drawer" class="btn btn-square btn-ghost">
            <Menu class="h-5 w-5" />
        </label>
    </div>
    <div class="flex-1">
        <span class="text-base-content/50 text-sm font-mono">admin / {activeTab}</span>
    </div>
    <div class="flex-none gap-2 items-center">
        <div class="badge badge-error badge-sm gap-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-error-content animate-pulse"></span>
            LIVE
        </div>
        <div class="avatar placeholder">
            <button class="btn btn-ghost btn-circle" onclick={toggleTheme}>
                {#if currentTheme === 'light'}<Moon class="w-5 h-5" />{:else}<Sun class="w-5 h-5" />{/if}
            </button>
        </div>
    </div>
</div>