<template>
  <div class="dark min-h-screen bg-[#0a0a0b] text-neutral-300">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-screen w-64 bg-[#1a1a1c] border-r border-neutral-800 z-40 flex flex-col">
      <div class="p-5 border-b border-neutral-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span class="text-white font-bold text-lg">SL</span>
          </div>
          <div>
            <h1 class="text-base font-bold text-white">Salud Laboral</h1>
            <p class="text-xs text-neutral-400">Gestión Integral</p>
          </div>
        </div>
      </div>

      <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
        <NuxtLink 
          to="/" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink 
          to="/admisiones" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Admisiones</span>
        </NuxtLink>

        <NuxtLink 
          to="/historia" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Historia Clínica</span>
        </NuxtLink>

        <NuxtLink 
          to="/laboratorio" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>Laboratorio</span>
        </NuxtLink>

        <NuxtLink 
          to="/concepto-aptitud" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Concepto Aptitud</span>
        </NuxtLink>

        <NuxtLink 
          to="/facturacion" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Facturación</span>
        </NuxtLink>

        <NuxtLink 
          to="/inventario-logistica" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Inventario</span>
        </NuxtLink>

        <NuxtLink 
          to="/reportes" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Reportes</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin" 
          class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-400 hover:bg-[#2a2a2d] hover:text-white"
          active-class="bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Administración</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-neutral-800">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-teal-500/20">
            {{ user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.nombre || 'Usuario' }}</p>
            <p class="text-xs text-neutral-400 truncate">{{ user?.dni || '...' }}</p>
          </div>
        </div>
        <button 
          @click="logout"
          class="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1.5 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header class="bg-[#1a1a1c] border-b border-neutral-800 sticky top-0 z-30">
        <div class="px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-white">Sistema de Salud Laboral</h2>
              <p class="text-sm text-neutral-400">Gestión integral de examenes médicos ocupacionales</p>
            </div>
            <div class="flex items-center space-x-3">
              <button class="p-2 rounded-lg hover:bg-[#2a2a2d] transition-colors relative text-neutral-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#1a1a1c]"></span>
              </button>
              <div class="h-8 w-px bg-neutral-800"></div>
              <span class="text text-xs text-neutral-400 uppercase tracking-widest font-semibold">Español</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout, initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>
