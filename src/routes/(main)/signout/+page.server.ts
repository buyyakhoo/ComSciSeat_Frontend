import { redirect } from '@sveltejs/kit'
import { clearAuthCookie } from '../../../auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
    clearAuthCookie({ cookies })
    throw redirect(303, '/auth')
}
