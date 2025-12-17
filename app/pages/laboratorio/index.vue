<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-white">Gestión de Laboratorio</h1>
        <p class="text-dark-400">Registro y gestión de resultados de laboratorio</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-dark-700 mb-6">
      <nav class="flex gap-6">
        <button
          @click="activeTab = 'registro'"
          :class="[
            'pb-4 px-2 text-sm font-medium transition-colors border-b-2',
            activeTab === 'registro' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          ]"
        >
          Registrar Nuevo Resultado
        </button>
        <button
          @click="activeTab = 'listado'"
          :class="[
            'pb-4 px-2 text-sm font-medium transition-colors border-b-2',
            activeTab === 'listado' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          ]"
        >
          Resultados de Laboratorio
        </button>
      </nav>
    </div>

    <!-- Tab: Registrar Nuevo Resultado -->
    <div v-if="activeTab === 'registro'" class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-8 max-w-3xl">
      <div class="space-y-6">
        <!-- Seleccionar Paciente -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar Paciente *</label>
          <select 
            v-model="selectedPaciente" 
            class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
          >
            <option :value="null" disabled>-- Seleccione un paciente --</option>
            <option v-for="paciente in allPacientes" :key="paciente.id" :value="paciente">
              {{ paciente.nombre }} - DNI: {{ paciente.dni }}
            </option>
          </select>
        </div>

        <!-- Nombre del Examen -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Examen *</label>
          <input 
            v-model="formResultado.examen"
            type="text" 
            class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            placeholder="Ej: Lab de rutina"
          />
        </div>

        <!-- ID de Muestra -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">ID de Muestra *</label>
          <input 
            v-model="formResultado.idMuestra"
            type="text" 
            class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            placeholder="Ej: 12356"
          />
        </div>

        <!-- Resultado -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Resultado *</label>
          <input 
            v-model="formResultado.valor"
            type="text" 
            class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            placeholder="Ej: Apto, Positivo, 10.5..."
          />
        </div>

        <!-- Archivo (Mock) -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Adjuntar Archivo (Opcional)</label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer hover:bg-[#2a2a2d] bg-[#0f0f11]">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Click para subir</span> o arrastar y soltar</p>
                <p class="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
              </div>
              <input type="file" class="hidden" @change="handleFile" />
            </label>
          </div>
          <div v-if="formResultado.archivo" class="mt-2 text-sm text-blue-400">
            Archivo seleccionado: {{ formResultado.archivo.name }}
          </div>
        </div>

        <!-- Botón Guardar -->
        <div class="flex justify-end pt-4">
          <button 
            @click="guardarResultado"
            :disabled="guardando"
            class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ guardando ? 'Guardando...' : 'Guardar Resultado' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tab: Resultados de Laboratorio -->
    <div v-if="activeTab === 'listado'">
      <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
        
        <!-- Buscador Reutilizable -->
        <div class="mb-6 max-w-md">
          <SearchInput 
            v-model="searchListQuery" 
            placeholder="Buscar por paciente, examen o muestra..." 
          />
        </div>

        <div v-if="loadingList" class="text-center py-8 text-gray-500">Cargando resultados...</div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-400 uppercase bg-[#0f0f11] border-b border-neutral-800">
              <tr>
                <th class="px-6 py-3">Fecha</th>
                <th class="px-6 py-3">Paciente</th>
                <th class="px-6 py-3">Examen</th>
                <th class="px-6 py-3">Muestra</th>
                <th class="px-6 py-3">Resultado</th>
                <th class="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in filteredResultados" :key="res.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d]">
                <td class="px-6 py-4">{{ formatDate(res.fecha) }}</td>
                <td class="px-6 py-4 font-medium text-white">{{ res.paciente }}</td>
                <td class="px-6 py-4">{{ res.examen }}</td>
                <td class="px-6 py-4 font-mono text-gray-400">{{ res.idMuestra || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs font-semibold border border-blue-900/50">
                    {{ res.valor }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="text-blue-400 hover:text-blue-300 hover:underline">Ver PDF</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <p v-if="!filteredResultados.length" class="text-center py-8 text-gray-500">
            No se encontraron resultados.
          </p>
        </div>
      </section>
    </div>

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
import SearchInput from '~/components/SearchInput.vue'

const activeTab = ref('registro')
const guardando = ref(false)
const loadingList = ref(false)
// const searchQuery = ref('') // Eliminated
const searchListQuery = ref('') // Para el buscador del listado
// const searchResults = ref<any[]>([]) // Eliminated
const selectedPaciente = ref<any>(null)
const resultados = ref<any[]>([])
const allPacientes = ref<any[]>([])

const filteredResultados = computed(() => {
  if (!searchListQuery.value) return resultados.value
  const query = searchListQuery.value.toLowerCase()
  return resultados.value.filter(r => 
    r.paciente.toLowerCase().includes(query) ||
    r.examen.toLowerCase().includes(query) ||
    (r.idMuestra && r.idMuestra.toLowerCase().includes(query))
  )
})

const formResultado = ref({
  examen: '',
  idMuestra: '',
  valor: '',
  archivo: null as File | null
})

const messageState = ref({ isOpen: false, title: '', message: '', type: 'info' as 'info'|'success'|'error' })

function showMessage(title: string, message: string, type: 'info'|'success'|'error' = 'info') {
  messageState.value = { isOpen: true, title, message, type }
}

async function cargarPacientes() {
  try {
    const data = await $fetch('/api/pacientes')
    allPacientes.value = data as any[]
  } catch (e) {
    console.error(e)
    showMessage('Error', 'No se pudieron cargar los pacientes', 'error')
  }
}

/* Eliminated search functions
async function buscarPacientes() { ... }
function seleccionarPaciente(paciente: any) { ... }
function limpiarSeleccion() { ... }
*/

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    formResultado.value.archivo = input.files[0]
  }
}

async function guardarResultado() {
  if (!selectedPaciente.value || !formResultado.value.examen || !formResultado.value.valor) {
    showMessage('Error', 'Complete los campos obligatorios (*)', 'error')
    return
  }

  guardando.value = true
  try {
    // Simulamos guardado ya que faltan endpoints específicos
    // await $fetch('/api/laboratorio', { method: 'POST', body: ... })
    
    // Mock para demo inmediata
    resultados.value.unshift({
      id: Date.now(),
      fecha: new Date().toISOString(),
      paciente: selectedPaciente.value.nombre,
      examen: formResultado.value.examen,
      idMuestra: formResultado.value.idMuestra,
      valor: formResultado.value.valor
    })

    showMessage('Éxito', 'Resultado de laboratorio registrado', 'success')
    
    // Reset form
    formResultado.value = { examen: '', idMuestra: '', valor: '', archivo: null }
    selectedPaciente.value = null
    activeTab.value = 'listado'
  } catch (e) {
    console.error(e)
    showMessage('Error', 'No se pudo guardar el resultado', 'error')
  } finally {
    guardando.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })
}

onMounted(async () => {
  await cargarPacientes()
})
</script>
