<script lang="ts">
  import { page } from "$app/state";
  import { LogIn } from 'lucide-svelte';

  let { form }: { form?: { error?: string } } = $props();

  const errorMessage = $derived.by(() => {
    const error = page.url.searchParams.get('error');
    if (error) {
      return error === 'no_code'
        ? 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองใหม่'
        : 'กรุณาใช้ email @kmitl.ac.th เท่านั้น';
    }

    return form?.error ?? '';
  });
</script>

<svelte:head>
  <title>เข้าสู่ระบบ - ComSciSeat</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-primary to-secondary">
  <div class="card w-full max-w-md bg-base-100 shadow-2xl">
    <div class="card-body p-8 text-center">

      <div class="text-6xl mb-4">💻</div>
      <h1 class="text-3xl font-bold text-base-content mb-2">ComSciSeat</h1>
      <p class="text-base-content/70 mb-6">ระบบจองโต๊ะคอมในห้องแลป คณะวิทยาศาสตร์ สาขาวิทยาการคอมพิวเตอร์</p>

      {#if errorMessage}
        <div class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      {/if}
      
      <form method="POST" class="w-full">
        <button type="submit" class="btn btn-primary btn-lg w-full shadow-lg">
          <LogIn class="w-6 h-6" />
          เข้าสู่ระบบด้วย Google
        </button>
      </form>
      
      <div class="text-xs text-base-content/50 mt-6">
        <p>© 2026 Science Faculty, KMITL</p>
        <p class="mt-2 text-info">กรุณาใช้ email @kmitl.ac.th</p>
      </div>
    </div>
  </div>
</div>
