import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth()
    if (session) {
        throw redirect(303, '/')
    }
}

export const actions: Actions = {
    default: async ({ url }) => {
        try {
            const redirectUri = `${url.origin}/auth/callback`
            const response = await fetch(`${env.BACKEND_API_URL}/api/auth/google/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`, {
                method: 'GET',
            })

            if (!response.ok) {
                return { error: 'Failed to get auth URL' }
            }

            const data = await response.json()
            if (!data.authUrl) {
                return { error: 'No auth URL returned' }
            }

            throw redirect(303, data.authUrl)
        } catch (error: any) {
            // Re-throw SvelteKit errors (redirect, error, etc)
            if (error?.status && typeof error.status === 'number') {
                throw error
            }
            console.error('Auth error:', error)
            return { error: 'Authentication initialization failed' }
        }
    },
}
