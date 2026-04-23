import type { Handle } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

const COOKIE_NAME = 'auth_token'
const PROFILE_IMAGE_COOKIE_NAME = 'profile_image'

function decodeJWT(token: string) {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '=')
        const payload = JSON.parse(atob(base64))
        return payload
    } catch {
        return null
    }
}

async function getSessionUser(fetch: typeof globalThis.fetch, token: string, userId: string, profileImage?: string) {
    const fallbackUser = {
        student_id: userId,
        image: profileImage,
    }

    try {
        const response = await fetch(`${env.BACKEND_API_URL}/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            console.error('Failed to fetch session user:', response.status, response.statusText)
            return fallbackUser
        }

        const data = await response.json()
        if (!data.success) return fallbackUser
        const user = data.user ?? data.data ?? data

        return {
            email: user.email,
            student_id: user.user_id ?? userId,
            role: user.user_type,
            name: user.name,
            image: user.image ?? user.picture ?? user.profile_picture ?? user.avatar_url ?? profileImage,
        }
    } catch (error) {
        console.error('Failed to fetch session user:', error)
        return fallbackUser
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(COOKIE_NAME)
    const profileImage = event.cookies.get(PROFILE_IMAGE_COOKIE_NAME)

    if (token) {
        const decoded = decodeJWT(token)
        const userId = decoded?.sub ?? decoded?.user_id
        if (decoded?.exp && decoded.exp * 1000 > Date.now() && userId) {
            let sessionPromise: ReturnType<typeof event.locals.auth> | undefined
            event.locals.auth = () => {
                sessionPromise ??= getSessionUser(event.fetch, token, userId, profileImage).then((user) => ({
                    user,
                    backendToken: token,
                    expires: new Date(decoded.exp * 1000).toISOString(),
                }))

                return sessionPromise
            }
        }
    }

    if (!event.locals.auth) {
        event.locals.auth = () => Promise.resolve(null)
    }

    return resolve(event)
}

export function setAuthCookie(event: { cookies: any }, token: string, expiresIn = 7) {
    const maxAge = expiresIn * 24 * 60 * 60

    event.cookies.set(COOKIE_NAME, token, {
        path: '/',
        maxAge,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })
}

export function setProfileImageCookie(event: { cookies: any }, image: string, expiresIn = 7) {
    const maxAge = expiresIn * 24 * 60 * 60

    event.cookies.set(PROFILE_IMAGE_COOKIE_NAME, image, {
        path: '/',
        maxAge,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })
}

export function clearAuthCookie(event: { cookies: any }) {
    event.cookies.delete(COOKIE_NAME, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })

    event.cookies.delete(PROFILE_IMAGE_COOKIE_NAME, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })
}
