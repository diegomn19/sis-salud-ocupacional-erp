<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Historia Clínica Ocupacional</h1>
        <p class="text-dark-400">Gestión y consulta de historias clínicas</p>
      </div>
    </div>

    <!-- Buscador y Filtros -->
    <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
          Historias Recientes
        </h2>
        <div class="w-full md:w-1/3">
          <SearchInput 
            v-model="searchQuery" 
            placeholder="Buscar por paciente, DNI o empresa..." 
          />
        </div>
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-500">Cargando historias...</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-[#0f0f11] border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3">Paciente</th>
              <th class="px-6 py-3">DNI</th>
              <th class="px-6 py-3">Empresa</th>
              <th class="px-6 py-3">Último Examen</th>
              <th class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="historia in filteredHistorias" :key="historia.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d]">
              <td class="px-6 py-4">{{ formatDate(historia.fecha) }}</td>
              <td class="px-6 py-4 font-medium text-white">{{ historia.paciente }}</td>
              <td class="px-6 py-4 text-gray-400 font-mono">{{ historia.dni }}</td>
              <td class="px-6 py-4">{{ historia.empresa || '-' }}</td>
              <td class="px-6 py-4">{{ historia.examen }}</td>
              <td class="px-6 py-4 text-center">
                <NuxtLink 
                  :to="`/historia/${historia.dni}`" 
                  class="text-emerald-400 hover:text-emerald-300 hover:underline font-medium"
                >
                  Ver Historia
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="!filteredHistorias.length" class="text-center py-8 text-gray-500">
          No se encontraron historias clínicas.
        </p>
      </div>
    </section>

    <!-- Modal de Confirmación (Reutilizable) -->
    <ConfirmDialog 
      :is-open="confirmState.isOpen" 
      :title="confirmState.title"
      :message="confirmState.message"
      @confirm="onConfirm"
      @cancel="confirmState.isOpen = false"
    />

    <!-- Message Dialog -->
    <MessageDialog 
      :is-open="messageState.isOpen" 
      :title="messageState.title" 
      :message="messageState.message" 
      :type="messageState.type" 
      @close="messageState.isOpen = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MessageDialog from '~/components/MessageDialog.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import SearchInput from '~/components/SearchInput.vue'

const loading = ref(true)
const historias = ref<any[]>([])
const searchQuery = ref('')
const confirmState = ref({ isOpen: false, title: '', message: '' })
const messageState = ref({ isOpen: false, title: '', message: '', type: 'info' as 'info'|'success'|'error' })

const filteredHistorias = computed(() => {
  if (!searchQuery.value) return historias.value
  const query = searchQuery.value.toLowerCase()
  return historias.value.filter(h => 
    h.paciente.toLowerCase().includes(query) ||
    h.dni.toLowerCase().includes(query) ||
    (h.empresa && h.empresa.toLowerCase().includes(query))
  )
})

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function showMessage(title: string, message: string, type: 'info'|'success'|'error' = 'info') {
  messageState.value = { isOpen: true, title, message, type }
}

function onConfirm() {
  // Logic for confirmation if needed
  confirmState.value.isOpen = false
}

async function cargarHistorias() {
  loading.value = true
  try {
    // Usamos el API existente o uno nuevo para listar
    // Por ahora simulamos una lista basada en admisiones recientes o creamos un endpoint específico
    // TODO: Crear endpoint /api/historia/list.get.ts si no existe
    // Fetch mock data for now based on user request "listado de historias"
    // In real app, check /api/admisiones/index.get.ts or similar
    
    // Attempting to fetch from existing admission list as base for history list
    const response = await $fetch<any>('/api/admisiones')
    const data = response.data || []
    historias.value = data.map((adm: any) => ({
      id: adm.id,
      fecha: adm.fecha,
      paciente: adm.paciente_nombre,
      dni: adm.dni,
      empresa: adm.empresa,
      examen: adm.tipo_examen
    }))

  } catch (e: any) {
    console.error(e)
    showMessage('Error', 'Error cargando historias clínicas', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarHistorias()
})
</script>
