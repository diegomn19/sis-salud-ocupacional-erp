export const useAuth = () => {
    const user = useState<any | null>('auth_user', () => null)
    const router = useRouter()

    const login = async (dni: string, password: string) => {
        try {
            const res = await $fetch<any>('/api/auth/login', {
                method: 'POST',
                body: { dni, password }
            })

            if (res.ok) {
                user.value = res.user

                // Store in localStorage for persistence across reloads (simple approach)
                // Ideally we let middleware/cookie handle this, but for simple "client knows who it is":
                if (process.client) {
                    localStorage.setItem('user_info', JSON.stringify(res.user))
                }

                router.push('/')
                return true
            }
        } catch (e: any) {
            console.error('Login error', e)
            throw e
        }
    }

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', { method: 'POST' })
        } catch (e) {
            console.error(e)
        } finally {
            user.value = null
            if (process.client) {
                localStorage.removeItem('user_info')
            }
            router.push('/login')
        }
    }

    // Initialize from local storage if available (Client side simple persistence)
    // Cookie is HttpOnly so we can't read it directly, but we saved user_info manually
    const initAuth = () => {
        if (process.client) {
            const stored = localStorage.getItem('user_info')
            if (stored) {
                try {
                    user.value = JSON.parse(stored)
                } catch (e) {
                    localStorage.removeItem('user_info')
                }
            }
        }
    }

    return {
        user,
        login,
        logout,
        initAuth
    }
}
