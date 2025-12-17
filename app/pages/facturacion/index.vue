<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white">Facturación y Tesorería</h1>
        <p class="text-dark-400">Gestión de comprobantes y pagos</p>
      </div>
      <button 
        @click="mostrarModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-900/20"
      >
        Nueva Factura
      </button>
    </div>

    <!-- Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-neutral-800 shadow-lg border-l-4 border-l-green-500">
        <p class="text-sm text-neutral-400">Ingresos del Mes</p>
        <p class="text-2xl font-bold text-white">S/ {{ totalMes.toLocaleString() }}</p>
      </div>
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-neutral-800 shadow-lg border-l-4 border-l-blue-500">
        <p class="text-sm text-neutral-400">Facturas Emitidas</p>
        <p class="text-2xl font-bold text-white">{{ facturas.length }}</p>
      </div>
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-neutral-800 shadow-lg border-l-4 border-l-yellow-500">
        <p class="text-sm text-neutral-400">Pendientes de Pago</p>
        <p class="text-2xl font-bold text-white">0</p>
      </div>
    </div>

    <!-- Tabla Facturas -->
    <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Comprobantes Emitidos
      </h2>
      
      <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-400 uppercase bg-[#0f0f11] border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3">Serie-Correlativo</th>
              <th class="px-6 py-3">Cliente</th>
              <th class="px-6 py-3">RUC/DNI</th>
              <th class="px-6 py-3 text-right">Total</th>
              <th class="px-6 py-3 text-center">Estado SUNAT</th>
              <th class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="factura in facturas" :key="factura.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d] text-gray-300">
              <td class="px-6 py-4">{{ formatDate(factura.fecha) }}</td>
              <td class="px-6 py-4 font-mono text-gray-400">{{ factura.serie }}-{{ factura.correlativo }}</td>
              <td class="px-6 py-4 font-medium text-white">{{ factura.cliente }}</td>
              <td class="px-6 py-4 font-mono">{{ factura.ruc || '-' }}</td>
              <td class="px-6 py-4 text-right font-medium text-white">S/ {{ Number(factura.total).toFixed(2) }}</td>
              <td class="px-6 py-4 text-center">
                <span :class="getEstadoClass(factura.estado_sunat)" class="px-2 py-1 rounded-full text-xs font-semibold border border-opacity-20">
                  {{ factura.estado_sunat }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <a :href="`/api/facturacion/pdf?id=${factura.id}`" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline mr-3 font-medium">PDF</a>
                <a :href="`/api/facturacion/xml?id=${factura.id}`" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline font-medium">XML</a>
              </td>
            </tr>
          </tbody>
        </table>
        
        <p v-if="!facturas.length" class="text-center py-8 text-gray-500">
          No hay facturas registradas
        </p>
      </div>
    </section>

    <!-- Modal Nueva Factura -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-2xl w-full mx-4 transform transition-all">
          <h3 class="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Nueva Factura
          </h3>
          
          <div v-if="cargandoPendientes" class="text-center py-8 text-gray-500">Cargando admisiones pendientes...</div>
          
          <div v-else class="space-y-4">
            <div v-if="!pendientes.length" class="text-center py-8 text-gray-500 border border-dashed border-neutral-800 rounded-lg">
              No hay admisiones pendientes de facturación.
            </div>

            <div v-else>
              <label class="block text-sm font-medium mb-2 text-neutral-300">Seleccionar Admisión</label>
              <div class="max-h-60 overflow-y-auto border border-neutral-800 rounded-lg bg-[#0f0f11]">
                <div 
                  v-for="admision in pendientes" 
                  :key="admision.id"
                  @click="seleccionarAdmision(admision)"
                  class="p-3 border-b border-neutral-800 hover:bg-[#2a2a2d] cursor-pointer flex justify-between items-center transition-colors"
                  :class="{'bg-blue-900/20 border-l-4 border-l-blue-500': selectedAdmision?.id === admision.id}"
                >
                  <div>
                    <div class="font-medium text-gray-200">{{ admision.paciente_nombre }}</div>
                    <div class="text-xs text-neutral-500">{{ admision.tipo_examen }} - {{ formatDate(admision.fecha) }}</div>
                  </div>
                  <div class="text-sm text-blue-400 font-medium">{{ admision.empresa || 'Particular' }}</div>
                </div>
              </div>
            </div>

            <div v-if="selectedAdmision" class="grid grid-cols-2 gap-4 mt-4 bg-[#0f0f11] p-4 rounded-lg border border-neutral-800">
              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-400">Serie</label>
                <input v-model="formFactura.serie" type="text" class="w-full bg-[#1a1a1c] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-400">Total (S/)</label>
                <input v-model.number="formFactura.total" type="number" class="w-full bg-[#1a1a1c] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="mostrarModal = false"
              class="px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              v-if="selectedAdmision || pendientes.length > 0" 
              @click="guardarFactura"
              :disabled="guardando || !selectedAdmision"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {{ guardando ? 'Emitiendo...' : 'Emitir Factura' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const facturas = ref<any[]>([])
const loading = ref(true)
const mostrarModal = ref(false)
const pendientes = ref<any[]>([])
const cargandoPendientes = ref(false)
const selectedAdmision = ref<any>(null)
const guardando = ref(false)

const formFactura = ref({
  serie: 'F001',
  total: 0
})

const totalMes = computed(() => {
  return facturas.value.reduce((acc, curr) => acc + Number(curr.total), 0)
})

watch(mostrarModal, (val) => {
  if (val) {
    cargarPendientes()
    selectedAdmision.value = null
    formFactura.value.total = 0
  }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString()
}

function getEstadoClass(estado: string) {
  return estado === 'ACEPTADO' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-gray-700 text-gray-400 border border-gray-600'
}

function seleccionarAdmision(adm: any) {
  selectedAdmision.value = adm
  // Simular precio base
  formFactura.value.total = 150.00
}

async function cargarPendientes() {
  cargandoPendientes.value = true
  try {
    const data = await $fetch('/api/facturacion/pendientes')
    pendientes.value = data as any[]
  } catch (e) {
    console.error(e)
  } finally {
    cargandoPendientes.value = false
  }
}

async function guardarFactura() {
  if (!selectedAdmision.value || !formFactura.value.total) return
  
  guardando.value = true
  try {
    const res = await $fetch<any>('/api/facturacion', {
      method: 'POST',
      body: {
        admision_id: selectedAdmision.value.id,
        ...formFactura.value
      }
    })
    
    // Éxito
    mostrarModal.value = false
    await cargarFacturas()
    
    // Abrir PDF automáticamente
    if (res.factura && res.factura.id) {
       window.open(`/api/facturacion/pdf?id=${res.factura.id}`, '_blank')
    } else {
       alert('Factura emitida correctamente')
    }

  } catch (e: any) {
    console.error(e)
    // Si es error de duplicado (Unique Constraint)
    if (e.message?.includes('Unique constraint') || e.statusMessage?.includes('Unique constraint')) {
      alert('Esta admisión ya tiene una factura generada. Actualizando lista...')
      mostrarModal.value = false
      cargarFacturas() // Forzar recarga
    } else {
      alert('Error emitiendo factura: ' + (e.statusMessage || e.message))
    }
  } finally {
    guardando.value = false
  }
}

async function cargarFacturas() {
  loading.value = true
  try {
    const data = await $fetch('/api/facturacion')
    facturas.value = data as any[]
    // También recargar pendientes para limpiar items stale
    cargarPendientes() 
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarFacturas()
})
</script>
