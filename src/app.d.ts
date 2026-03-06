// src/app.d.ts
import type { DefaultSession } from "@auth/sveltekit";

declare module "@auth/sveltekit" {
    interface Session {
        backendToken?: string;
        user: {
            student_id?: string;
            role?: string;
        } & DefaultSession["user"];
    }
}