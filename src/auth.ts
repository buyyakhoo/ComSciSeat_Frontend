import type { Handle } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

const COOKIE_NAME = 'auth_token'
const PROFILE_IMAGE_COOKIE_NAME = 'profile_image'
const SESSION_USER_COOKIE_NAME = 'session_user'

type SessionUserCookie = {
    email?: string | null
    student_id?: string | null
    role?: string | null
    name?: string | null
    image?: string | null
}

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

function parseSessionUserCookie(value?: string): SessionUserCookie | null {
    if (!value) return null

    try {
        return JSON.parse(decodeURIComponent(value))
    } catch {
        return null
    }
}

function toSessionUser(user?: Record<string, any> | null, fallback?: SessionUserCookie | null): SessionUserCookie {
    return {
        email: user?.email ?? fallback?.email,
        student_id: user?.student_id ?? fallback?.student_id,
        role: user?.user_type ?? user?.role ?? fallback?.role,
        name: user?.name ?? fallback?.name,
        image: user?.image ?? user?.picture ?? user?.profile_picture ?? user?.avatar_url ?? fallback?.image,
    }
}

function getLookupStudentId(studentId?: string | null) {
    if (!studentId) return null

    const value = String(studentId)
    return /^\d{8}$/.test(value) ? value : null
}

async function getSessionUser(
    fetch: typeof globalThis.fetch,
    token: string,
    tokenUserId: string,
    profileImage?: string,
    storedUser?: SessionUserCookie | null
) {
    const fallbackUser = {
        email: storedUser?.email,
        student_id: storedUser?.student_id,
        role: storedUser?.role,
        name: storedUser?.name,
        image: storedUser?.image ?? profileImage,
    }

    try {
        const response = await fetch(`${env.BACKEND_API_URL}/api/user/${tokenUserId}`, {
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

        return toSessionUser(user, fallbackUser)
    } catch (error) {
        console.error('Failed to fetch session user:', error)
        return fallbackUser
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(COOKIE_NAME)
    const profileImage = event.cookies.get(PROFILE_IMAGE_COOKIE_NAME)
    const storedUser = parseSessionUserCookie(event.cookies.get(SESSION_USER_COOKIE_NAME))

    if (token) {
        const decoded = decodeJWT(token)
        const tokenUserId = decoded?.user_id ?? decoded?.sub
        if (decoded?.exp && decoded.exp * 1000 > Date.now() && tokenUserId) {
            let sessionPromise: ReturnType<typeof event.locals.auth> | undefined
            event.locals.auth = () => {
                sessionPromise ??= getSessionUser(event.fetch, token, tokenUserId, profileImage, storedUser).then((user) => ({
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

export function setSessionUserCookie(event: { cookies: any }, user: Record<string, any>, expiresIn = 7) {
    const maxAge = expiresIn * 24 * 60 * 60
    const sessionUser = toSessionUser(user)

    event.cookies.set(SESSION_USER_COOKIE_NAME, encodeURIComponent(JSON.stringify(sessionUser)), {
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

    event.cookies.delete(SESSION_USER_COOKIE_NAME, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })
}
