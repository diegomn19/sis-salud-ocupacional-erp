<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-white">Inventario y Logística</h1>
      <div class="flex gap-2">
        <button 
          @click="enviarNotificacion('BAJO_STOCK')"
          class="bg-[#1a1a1c] border border-red-900 text-red-400 px-4 py-2 rounded-lg hover:bg-red-900/30 transition-colors font-medium flex items-center gap-2"
        >
          <span>⚠️</span> Notificar Bajo Stock
        </button>
        <button 
          @click="enviarNotificacion('GENERAL')"
          class="bg-[#1a1a1c] border border-neutral-700 text-neutral-300 px-4 py-2 rounded-lg hover:bg-[#2a2a2d] transition-colors font-medium flex items-center gap-2"
        >
          <span>📋</span> Reporte General
        </button>
        <button 
          @click="abrirModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          + Nuevo Producto
        </button>
      </div>
    </div>

    <!-- Resumen de Stock -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-neutral-800 shadow-lg">
        <div class="text-sm text-neutral-400">Total Items</div>
        <div class="text-2xl font-bold text-white">{{ productos.length }}</div>
      </div>
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-neutral-800 shadow-lg">
        <div class="text-sm text-neutral-400">Valor Inventario</div>
        <div class="text-2xl font-bold text-white">S/ 12,500</div>
        <div class="text-xs text-neutral-500">Estimado</div>
      </div>
      <div class="bg-[#1a1a1c] p-6 rounded-xl border border-l-4 border-l-red-500 bg-red-900/10 border-neutral-800">
        <div class="text-sm text-red-400">Stock Crítico</div>
        <div class="text-2xl font-bold text-red-500">{{ stockCritico }}</div>
        <div class="text-xs text-red-400/70">Items por debajo del mínimo</div>
      </div>
    </div>

    <!-- Tabla de Productos -->
    <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Control de Stock
      </h2>

      <div v-if="loading" class="text-center py-8 text-gray-500">Cargando inventario...</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-400 uppercase bg-[#0f0f11] border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3">Producto / Insumo</th>
              <th class="px-6 py-3 text-center">Stock Actual</th>
              <th class="px-6 py-3 text-center">Stock Mínimo</th>
              <th class="px-6 py-3 text-center">Estado</th>
              <th class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d] text-gray-300">
              <td class="px-6 py-4 font-medium text-white">{{ producto.nombre }}</td>
              <td class="px-6 py-4 text-center text-lg font-mono">{{ producto.stock_actual }}</td>
              <td class="px-6 py-4 text-center text-gray-500">{{ producto.stock_min }}</td>
              <td class="px-6 py-4 text-center">
                <span 
                  v-if="producto.stock_actual <= producto.stock_min"
                  class="bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs font-bold border border-red-900/50"
                >
                  BAJO STOCK
                </span>
                <span 
                  v-else
                  class="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs border border-green-900/50"
                >
                  OK
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button 
                  @click="abrirModal(producto)"
                  class="text-blue-400 hover:text-blue-300 hover:underline text-xs mr-3 font-medium"
                >
                  Editar
                </button>
                <button 
                  @click="confirmarEliminar(producto)"
                  class="text-red-400 hover:text-red-300 hover:underline text-xs font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="!productos.length" class="text-center py-8 text-gray-500">
          No hay productos en inventario
        </p>
      </div>
    </section>

    <!-- Modal Producto -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
          <h3 class="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {{ editMode ? 'Editar Producto' : 'Registrar Nuevo Producto' }}
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-neutral-300">Nombre del Producto</label>
              <input 
                v-model="formProducto.nombre"
                type="text" 
                class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                placeholder="Ej: Paracetamol 500mg"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-300">Stock Actual</label>
                <input 
                  v-model.number="formProducto.stock_actual"
                  type="number" 
                  class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 text-neutral-300">Stock Mínimo</label>
                <input 
                  v-model.number="formProducto.stock_min"
                  type="number" 
                  class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
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
              @click="guardarProducto"
              :disabled="guardando"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Confirm Dialog -->
    <ConfirmDialog 
      :is-open="confirmState.isOpen" 
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :confirm-class="confirmState.confirmClass"
      @confirm="handleConfirmAction"
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
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import MessageDialog from '~/components/MessageDialog.vue'

const productos = ref<any[]>([])
const loading = ref(true)
const mostrarModal = ref(false)
const guardando = ref(false)
const editMode = ref(false)
const selectedId = ref<string | null>(null)

const confirmState = ref({
  isOpen: false,
  title: 'Confirmar',
  message: '',
  confirmText: 'Confirmar',
  confirmClass: 'bg-red-600 hover:bg-red-700',
  action: null as Function | null
})

const messageState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
})

const formProducto = ref({
  nombre: '',
  stock_actual: 0,
  stock_min: 10
})

const stockCritico = computed(() => {
  return productos.value.filter(p => p.stock_actual <= p.stock_min).length
})

function showMessage(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
  messageState.value = { isOpen: true, title, message, type }
}

async function cargarProductos() {
  loading.value = true
  try {
    const data = await $fetch('/api/inventario')
    productos.value = data as any[]
  } catch (e: any) {
    console.error(e)
    showMessage('Error', 'Error cargando inventario', 'error')
  } finally {
    loading.value = false
  }
}

function abrirModal(item?: any) {
  if (item) {
    editMode.value = true
    selectedId.value = item.id
    formProducto.value = { ...item }
  } else {
    editMode.value = false
    selectedId.value = null
    formProducto.value = { nombre: '', stock_actual: 0, stock_min: 10 }
  }
  mostrarModal.value = true
}

async function guardarProducto() {
  if (!formProducto.value.nombre) {
    showMessage('Error', 'Ingrese el nombre del producto', 'error')
    return
  }
  
  guardando.value = true
  try {
    if (editMode.value && selectedId.value) {
      await $fetch('/api/inventario', {
        method: 'PUT',
        body: { id: selectedId.value, ...formProducto.value }
      })
      showMessage('Éxito', 'Producto actualizado correctamente', 'success')
    } else {
      await $fetch('/api/inventario', {
        method: 'POST',
        body: formProducto.value
      })
      showMessage('Éxito', 'Producto registrado correctamente', 'success')
    }
    
    mostrarModal.value = false
    await cargarProductos()
  } catch (e: any) {
    console.error(e)
    showMessage('Error', 'Error al guardar producto', 'error')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(item: any) {
  confirmState.value = {
    isOpen: true,
    title: 'Eliminar Producto',
    message: `¿Estás seguro de eliminar "${item.nombre}"?`,
    confirmText: 'Eliminar',
    confirmClass: 'bg-red-600 hover:bg-red-700',
    action: async () => {
      try {
        await $fetch('/api/inventario', {
          method: 'DELETE',
          body: { id: item.id }
        })
        showMessage('Éxito', 'Producto eliminado', 'success')
        await cargarProductos()
      } catch (e: any) {
        console.error(e)
        showMessage('Error', 'No se pudo eliminar el producto', 'error')
      }
    }
  }
}

async function handleConfirmAction() {
  confirmState.value.isOpen = false
  if (confirmState.value.action) {
    await confirmState.value.action()
  }
}

function enviarNotificacion(tipo: 'BAJO_STOCK' | 'GENERAL') {
  const isStock = tipo === 'BAJO_STOCK'
  
  confirmState.value = {
    isOpen: true,
    title: isStock ? 'Notificar Bajo Stock' : 'Reporte General',
    message: isStock 
      ? '¿Deseas enviar una alerta al correo de Logística con todos los productos que están por debajo del stock mínimo?' 
      : '¿Deseas enviar un reporte completo del inventario actual al correo de Logística?',
    confirmText: 'Enviar Reporte',
    confirmClass: isStock ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700',
    action: async () => {
      try {
        const res = await $fetch<any>('/api/inventario/notificaciones/enviar', {
          method: 'POST',
          body: { tipo }
        })
        
        if (res.ok) {
          showMessage('Notificación Enviada', res.message, 'success')
        } else {
          showMessage('Error', res.message || 'Error al enviar', 'error')
        }
      } catch (e) {
        console.error(e)
        showMessage('Error', 'No se pudo conectar con el servidor de notificaciones', 'error')
      }
    }
  }
}

onMounted(() => {
  cargarProductos()
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
