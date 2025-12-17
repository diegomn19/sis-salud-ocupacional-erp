<template>
  <div class="min-h-screen flex items-center justify-center bg-[#09090b] p-4">
    <div class="max-w-md w-full bg-[#1a1a1c] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden relative">
      <!-- Decorative gradient -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>

      <div class="p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/10 mb-4">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Bienvenido</h1>
          <p class="text-neutral-400">Ingresa tus credenciales para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">DNI</label>
            <input 
              v-model="dni"
              type="text" 
              class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-600 transition-colors"
              placeholder="Ingrese su DNI"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Contraseña</label>
            <input 
              v-model="password"
              type="password" 
              class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-600 transition-colors"
              placeholder="••••••••"
              required
            >
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
            {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
      
      <div class="bg-[#151517] p-4 text-center border-t border-neutral-800">
        <p class="text-xs text-neutral-500">Sistema de Salud Laboral v2.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const dni = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

definePageMeta({
  layout: 'empty'
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await login(dni.value, password.value)
  } catch (e: any) {
    error.value = e.statusMessage || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
