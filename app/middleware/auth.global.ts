export default defineNuxtRouteMiddleware((to, from) => {
    // Skip on server for now to avoid complexity with cookies vs storage
    // But logically:
    const token = useCookie('auth_token')

    // Public routes
    const publicRoutes = ['/login']

    if (token.value) {
        // User is logged in
        if (to.path === '/login') {
            return navigateTo('/')
        }
    } else {
        // User is NOT logged in
        if (!publicRoutes.includes(to.path)) {
            return navigateTo('/login')
        }
    }
})
