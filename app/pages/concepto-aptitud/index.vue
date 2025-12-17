<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-white">Concepto de Aptitud</h1>

    <!-- Listado de Pacientes para Aptitud -->
    <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6 space-y-4">
      <h2 class="text-xl font-semibold text-white">Pacientes Pendientes de Aptitud</h2>
      
      <div v-if="loading" class="text-center py-8">
        <p class="text-neutral-500">Cargando pacientes...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-400 uppercase bg-[#0a0a0b] border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3">Paciente</th>
              <th class="px-6 py-3">DNI</th>
              <th class="px-6 py-3">Empresa</th>
              <th class="px-6 py-3">Examen</th>
              <th class="px-6 py-3">Estado Actual</th>
              <th class="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admision in admisiones" :key="admision.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d]/50 text-neutral-300">
              <td class="px-6 py-4">{{ formatFecha(admision.fecha) }}</td>
              <td class="px-6 py-4 font-medium text-white">{{ admision.paciente_nombre }}</td>
              <td class="px-6 py-4 font-mono text-gray-400">{{ admision.dni }}</td>
              <td class="px-6 py-4">{{ admision.empresa || '-' }}</td>
              <td class="px-6 py-4">{{ admision.tipo_examen }}</td>
              <td class="px-6 py-4">
                <span :class="getEstadoClass(admision.estado_aptitud)" class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  {{ admision.estado_aptitud || 'PENDIENTE' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="abrirModal(admision)"
                  class="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-xs font-medium transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Emitir Aptitud
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!admisiones.length" class="text-center py-8 text-neutral-500">
          No hay pacientes pendientes de aptitud
        </p>
      </div>
    </section>

    <!-- Modal Emisión Aptitud -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="mostrarModal" class="fixed inset-0 bg-[#0a0a0b]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-lg w-full mx-4 transform transition-all">
            <h3 class="text-lg font-bold mb-4 text-white">Emitir Concepto de Aptitud</h3>
            
            <div class="space-y-4" v-if="selectedAdmision">
              <div class="bg-[#0f0f11] border border-neutral-700 p-3 rounded-lg text-sm text-neutral-300">
                <p><strong class="text-white">Paciente:</strong> {{ selectedAdmision.paciente_nombre }}</p>
                <p><strong class="text-white">DNI:</strong> {{ selectedAdmision.dni }}</p>
                <p><strong class="text-white">Examen:</strong> {{ selectedAdmision.tipo_examen }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-300">Resultado de Aptitud</label>
                <select v-model="formAptitud.resultado" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500">
                  <option value="APTO">APTO</option>
                  <option value="APTO CON RESTRICCIONES">APTO CON RESTRICCIONES</option>
                  <option value="NO APTO">NO APTO</option>
                </select>
                <p class="text-xs text-neutral-500 mt-1">Seleccione el resultado exacto.</p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-300">Observaciones / Restricciones</label>
                <textarea
                  v-model="formAptitud.observaciones"
                  rows="3"
                  class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500"
                  placeholder="Detalle las restricciones o motivos..."
                ></textarea>
              </div>

              <div class="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Al guardar, se generará el certificado y se notificará al paciente.</p>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                @click="cerrarModal"
                class="px-4 py-2 text-neutral-400 hover:text-white hover:bg-[#2a2a2d] rounded-lg transition-colors"
                :disabled="guardando"
              >
                Cancelar
              </button>
              <button
                @click="guardarAptitud"
                :disabled="guardando"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium shadow-lg shadow-emerald-600/20"
              >
                {{ guardando ? 'Guardando...' : 'Guardar y Firmar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MessageModal Component -->
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
import { ref, onMounted } from 'vue'
import MessageDialog from '~/components/MessageDialog.vue'

const loading = ref(true)
const admisiones = ref<any[]>([])
const mostrarModal = ref(false)
const selectedAdmision = ref<any>(null)
const guardando = ref(false)

const messageState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
})

const formAptitud = ref({
  resultado: 'APTO',
  observaciones: ''
})

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString()
}

function getEstadoClass(estado: string | null) {
  if (!estado) return 'bg-neutral-800 text-neutral-400 border border-neutral-700'
  const map: Record<string, string> = {
    'APTO': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'NO APTO': 'bg-red-500/10 text-red-400 border border-red-500/20',
    'APTO CON RESTRICCIONES': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'OBSERVADO': 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
  }
  return map[estado] || 'bg-neutral-800 text-neutral-400 border border-neutral-700'
}

function showMessage(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
  messageState.value = { isOpen: true, title, message, type }
}

async function cargarDatos() {
  loading.value = true
  try {
    const data = await $fetch('/api/aptitud')
    admisiones.value = data as any[]
  } catch (e: any) {
    showMessage('Error', 'Error cargando admisiones: ' + (e.message || 'Desconocido'), 'error')
  } finally {
    loading.value = false
  }
}

function abrirModal(item: any) {
  selectedAdmision.value = item
  formAptitud.value = {
    resultado: item.estado_aptitud || 'APTO',
    observaciones: ''
  }
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  selectedAdmision.value = null
}

async function guardarAptitud() {
  if (!formAptitud.value.resultado) {
    showMessage('Error', 'Debe seleccionar un resultado', 'error')
    return
  }

  guardando.value = true
  try {
    const res = await $fetch<any>('/api/aptitud', {
      method: 'POST',
      body: {
        admision_id: selectedAdmision.value.id,
        resultado: formAptitud.value.resultado,
        observaciones: formAptitud.value.observaciones
      }
    })
    
    if (res.success) {
      showMessage('Éxito', 'Aptitud registrada correctamente', 'success')
      cerrarModal()
      await cargarDatos()
    } else {
      showMessage('Error', res.message || 'Error al guardar', 'error')
    }
  } catch (e: any) {
    console.error(e)
    showMessage('Error', e.data?.message || e.message || 'Error de conexión', 'error')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
