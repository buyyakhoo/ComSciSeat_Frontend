import { SvelteKitAuth, type User } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"

// import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET, BACKEND_API_URL } from '$env/static/private';
import { env } from '$env/dynamic/private'

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
    const authOptions = {
        providers: [
            Google({
                clientId: env.AUTH_GOOGLE_ID,
                clientSecret: env.AUTH_GOOGLE_SECRET
            })
        ],
        secret: env.AUTH_SECRET,
        trustHost: true,
        debug: true,
        callbacks: {
            async signIn({ user, account, profile }: { user: User, account?: any, profile?: any }) {

                if (!user.email?.endsWith('@kmitl.ac.th')) {
                    return false;
                }
                try {
                    const username = user.email.split('@')[0];
                    const student_id = username.substring(0, 8);

                    console.log('Sending OAuth data to backend...');
                    console.log('Email:', user.email);
                    console.log('Student ID:', student_id);

                    console.log('BACKEND_API_URL: ' + env.BACKEND_API_URL);

                    const response = await fetch(`${env.BACKEND_API_URL}/user_service/verify-or-create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${account?.id_token || account?.access_token || ''}`
                        },
                        body: JSON.stringify({
                            user_id: student_id,
                            email: user.email,
                            name: user.name || 'Unknown User',
                            googleId: user.id,
                            image: user.image
                        })
                    });

                    // รอ response จาก Backend
                    const data = await response.json();
                    
                    console.log('Backend response:', data);

                    if (!response.ok) {
                        console.error('Backend error:', data);
                        return false;
                    }

                    if (!data.success) {
                        console.error('Verification failed:', data.error);
                        return false;
                    }

                    if (data.token) {
                        account.backendToken = data.token;
                        console.log('Token received and stored:', data.token.substring(0, 20) + '...');
                    }

                    // (user as any).appToken = data.token;
                    // console.log('User verified/created successfully!');
                    return true;

                } catch (error) {
                    console.error('Error sending data to backend:', error);
                    return false; 
                }
            },

            async jwt({ token, account }: { token: Record<string, any>, account?: any, profile?: any }) {
                // เก็บ backend token จาก account ไว้ใน JWT token
                if (account?.backendToken) {
                    token.backendToken = account.backendToken;
                }

                // เก็บ picture จาก Google profile
                return token;
            },

            async session({ session, token }: { session: Record<string, any>, token: any }) {
                console.log('test' + JSON.stringify(session));

                if (token.backendToken) {
                    session.backendToken = token.backendToken;
                }

                // เพิ่มข้อมูลเพิ่มเติมใน session
                if (session.user?.email) {
                    // ตัวอย่างการดึงข้อมูลนักศึกษา
                    const userData = await getUserDataFromBackend(session.user.email, session.backendToken);
                    
                    session.user = {
                        ...session.user,
                        student_id: userData?.student_id,
                        role: userData?.role || 'student',
                        image: token.picture || session.user.image,
                        backendToken: token.backendToken 
                    };
                }

                session.backendToken = token.backendToken;

                return {
                    ...session,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // Example: 7 days from now
                };
            }
        }
    }
    return authOptions;
});

// ฟังก์ชันจำลองการดึงข้อมูลผู้ใช้
async function getUserDataFromBackend(email: string, backendToken: string) {
    const username = email.split('@')[0];
    const student_id = username.substring(0, 8);

    const response = await fetch(`${env.BACKEND_API_URL}/user_service/user/${student_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${backendToken}`
        }
    })

    if (!response.ok) {
        console.error('Failed to fetch user data from backend');
        return null;
    }

    const data = await response.json();

    console.log('User data from backend:', data , " ", data.success);   

    if (!data.success) {
        console.error('Backend error:', data.error);
        return null;
    }

    return {
        student_id: student_id,
        role: data.user_type
    }
}