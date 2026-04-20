import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { setAuthCookie } from '../../../auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, cookies }) => {
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
        throw redirect(303, `/auth?error=${error}`)
    }

    if (!code) {
        throw redirect(303, '/auth?error=no_code')
    }

    try {
        const redirectUri = `${url.origin}/auth/callback`
        const response = await fetch(`${env.BACKEND_API_URL}/api/auth/google/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                redirectUri,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Authentication failed')
        }

        const data = await response.json()
        if (!data.success || !data.token) {
            throw new Error(data.error || 'No token received')
        }

        setAuthCookie({ cookies }, data.token)
        throw redirect(303, '/')
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.error('OAuth callback error:', error)
        throw redirect(303, `/auth?error=${encodeURIComponent(errorMsg)}`)
    }
}
