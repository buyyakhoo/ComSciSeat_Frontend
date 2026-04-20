import type { Handle } from '@sveltejs/kit'

const COOKIE_NAME = 'auth_token'

function decodeJWT(token: string) {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(atob(parts[1]))
        return payload
    } catch {
        return null
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(COOKIE_NAME)

    if (token) {
        const decoded = decodeJWT(token)
        if (decoded?.exp && decoded.exp * 1000 > Date.now()) {
            event.locals.auth = () => Promise.resolve({
                user: {
                    email: decoded.email,
                    student_id: decoded.user_id,
                    role: decoded.user_type,
                    name: decoded.name,
                    image: decoded.image,
                },
                backendToken: token,
                expires: new Date(decoded.exp * 1000).toISOString(),
            })
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

export function clearAuthCookie(event: { cookies: any }) {
    event.cookies.delete(COOKIE_NAME, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    })
}