<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/historia" class="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-white">Historia Clínica</h1>
        <p class="text-dark-400" v-if="paciente">DNI: {{ dni }} | {{ paciente.nombre_completo }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
      <p class="mt-4 text-gray-400">Cargando historia clínica...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
      <p class="text-red-400">Error al cargar la historia clínica. Por favor intente nuevamente.</p>
      <button @click="() => refresh()" class="mt-4 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded text-sm text-white transition-colors">
        Reintentar
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar: Patient Info -->
      <div class="space-y-6">
        <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl font-bold uppercase">
              {{ paciente.nombre?.charAt(0) }}{{ paciente.apellidos?.charAt(0) }}
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ paciente.nombre }}</h2>
              <p class="text-emerald-400">{{ paciente.apellidos }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">DNI</span>
              <span class="text-white font-mono">{{ paciente.dni }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">Fecha Nacimiento</span>
              <span class="text-white">{{ formatDate(paciente.fecha_nacimiento) }}</span>
            </div>
             <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">Edad</span>
              <span class="text-white">{{ calculateAge(paciente.fecha_nacimiento) }} años</span>
            </div>
            <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">Sexo</span>
              <span class="text-white">{{ paciente.sexo || '-' }}</span>
            </div>
             <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">Empresa</span>
              <span class="text-white">{{ paciente.empresa?.razon_social || 'Particular' }}</span>
            </div>
             <div class="flex justify-between py-2 border-b border-neutral-800">
              <span class="text-gray-400">Tipo Sangre</span>
              <span class="text-white">{{ paciente.tipo_sangre || '-' }}</span>
            </div>
             <div class="py-2">
              <span class="text-gray-400 block mb-1">Alergias</span>
              <p class="text-white text-sm bg-[#0f0f11] p-2 rounded border border-neutral-800">{{ paciente.alergias || 'Ninguna conocida' }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Main Content: Timeline -->
      <div class="lg:col-span-2 space-y-6">
        <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
          <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Historial de Atenciones
          </h3>

          <div v-if="!historia?.length" class="text-center py-12 text-gray-500 bg-[#0f0f11] rounded-lg border border-dashed border-neutral-800">
            No hay registros médicos para mostrar.
          </div>

          <!-- Single Column Timeline -->
          <div v-else class="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-neutral-800 before:to-transparent">
            
            <div v-for="(item, index) in historia" :key="item.id" class="relative">
              
              <!-- Icon on the line -->
              <div class="absolute -left-[34px] top-1 flex items-center justify-center w-8 h-8 rounded-full border border-neutral-700 bg-[#1a1a1c] text-emerald-500 shadow z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <!-- Card -->
              <div class="bg-[#0f0f11] p-5 rounded-lg border border-neutral-800 shadow-sm transition-all hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/10">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <h4 class="text-base font-bold text-white">{{ item.tipo_examen }}</h4>
                  <time class="text-xs font-mono text-gray-400 mt-1 sm:mt-0 bg-[#1a1a1c] px-2 py-1 rounded border border-neutral-800">{{ formatDate(item.fecha) }}</time>
                </div>
                
                <div class="text-sm text-gray-400 mb-4" v-if="item.observaciones">
                    {{ item.observaciones }}
                </div>
                
                <!-- Documents List -->
                <div v-if="item.archivos?.length" class="mt-3 space-y-2 border-t border-neutral-800 pt-3">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                      Documentos Adjuntos
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <a 
                            v-for="archivo in item.archivos" 
                            :key="archivo.id"
                            :href="archivo.url"
                            target="_blank"
                            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1a1a1c] border border-neutral-700 hover:bg-neutral-800 hover:border-emerald-500/50 text-xs text-emerald-400 group transition-all"
                        >
                            <span>{{ archivo.nombre }}</span>
                            <svg class="h-3 w-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>
              </div>
              
            </div>

          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const dni = route.params.dni as string

interface Paciente {
  id: number
  nombre: string | null
  apellidos: string | null
  nombre_completo: string
  dni: string
  fecha_nacimiento: string
  sexo: string | null
  tipo_sangre: string | null
  alergias: string | null
  empresa: { razon_social: string } | null
}

interface HistoriaItem {
  id: number
  tipo_examen: string
  fecha: string
  observaciones: string | null
  archivos: { id: number; url: string; nombre: string }[]
}

interface ApiResponse {
  ok: boolean
  found: boolean
  paciente?: Paciente
  historia?: HistoriaItem[]
}

const { data, pending, error, refresh } = await useFetch<ApiResponse>(`/api/historia/${dni}`)

const paciente = computed(() => data.value?.paciente || {} as Paciente)
const historia = computed(() => data.value?.historia || [])

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  try {
    const d = new Date(dateString)
    // Fix timezone offset issue manually if needed, or rely on locale
    // Simplest: use UTC methods if data stored as such, but usually DB returns ISO
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}

const calculateAge = (dateString: string) => {
    if (!dateString) return 0
    try {
        const today = new Date()
        const birthDate = new Date(dateString)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        // Check if birthdate is valid
        if (isNaN(birthDate.getTime())) return 0
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    } catch (e) {
        return 0
    }
}
</script>
