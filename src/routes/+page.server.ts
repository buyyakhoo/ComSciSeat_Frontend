import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BACKEND_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session) {
        redirect(302, '/auth');
    }
    const response = await fetch(`${BACKEND_API_URL}/api/labs`);
    const responseData = await response.json();
    return {
        session,
        labRooms: responseData.success ? responseData.data : []
    }
}   