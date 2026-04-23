import type { Session } from '$lib/shared/types/usermode';

declare global {
    namespace App {
        interface Locals {
            auth: () => Promise<Session | null>;
        }

        interface PageData {
            session?: Session | null;
        }
    }
}

export {};
