<script lang="ts">
    import { Mail, User, LogOut, GraduationCap } from 'lucide-svelte';
    import { SignOut } from "@auth/sveltekit/components";
    import type { Session } from '@auth/sveltekit';
    import type { UserStu } from '$lib/shared/types';

    export let session: { 
        user?: UserStu
    };
</script>

<div class="card bg-base-100 shadow-lg mb-4 sm:mb-6">
    <div class="card-body p-4 sm:p-6 lg:p-8">
        <div class="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-4 w-full">
            
            <div class="flex flex-col lg:flex-row items-center lg:items-start gap-4 text-center lg:text-left w-full lg:w-auto">
                
                <div class="avatar shrink-0">
                    <div class="w-24 sm:w-20 lg:w-16 xl:w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={session.user?.image} alt="User avatar" />
                    </div>
                </div>
                
                <div class="flex flex-col items-center lg:items-start w-full">
                    <h2 class="text-xl sm:text-2xl font-bold text-base-content break-words">
                        Hello {session.user?.name}
                    </h2>
                    
                    <div class="flex flex-wrap justify-center lg:justify-start gap-2 mt-3 lg:mt-2">
                        <div class="badge bg-primary text-primary-content py-3 px-3 sm:py-2 sm:px-2">
                            <Mail class="w-3 h-3 mr-1" />
                            <span class="truncate max-w-[200px] sm:max-w-none">{session.user?.email}</span>
                        </div>
                        
                        {#if session.user?.student_id}
                        <div class="badge bg-primary text-primary-content py-3 px-3 sm:py-2 sm:px-2">
                            <GraduationCap class="w-3 h-3 mr-1" />
                            Student ID: {session.user.student_id}
                        </div>
                        {/if}
                        
                        <div class="badge bg-primary text-primary-content py-3 px-3 sm:py-2 sm:px-2">
                            <User class="w-3 h-3 mr-1" />
                            {session.user?.role || 'student'}
                        </div>
                    </div>
                </div>
            </div>

            <SignOut redirectTo="/auth">
                <div slot="submitButton" class="w-full lg:w-auto flex justify-center lg:justify-end mt-2 lg:mt-0 shrink-0 btn btn-outline btn-sm sm:btn-md min-w-[120px]">
                    <LogOut class="w-4 h-4" />
                    Logout
                </div>
            </SignOut>
            
        </div>
    </div>
</div>