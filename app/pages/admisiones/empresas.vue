<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Gestión de Empresas</h1>
        <p class="text-dark-400 text-sm">Administración de empresas clientes</p>
      </div>
      <button @click="mostrarForm = true" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        + Nueva Empresa
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input 
        v-model="busqueda" 
        type="text" 
        placeholder="Buscar por RUC o razón social..." 
        class="w-full max-w-md bg-[#0f0f11] text-white rounded-lg px-4 py-2 border border-neutral-800 outline-none focus:border-emerald-500"
        @input="filtrar"
      />
    </div>

    <!-- Table -->
    <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-neutral-800 bg-[#0f0f11]">
            <th class="text-left py-3 px-4 text-neutral-400 font-medium">RUC</th>
            <th class="text-left py-3 px-4 text-neutral-400 font-medium">Razón Social</th>
            <th class="text-left py-3 px-4 text-neutral-400 font-medium">Contacto</th>
            <th class="text-left py-3 px-4 text-neutral-400 font-medium">Estado</th>
            <th class="text-left py-3 px-4 text-neutral-400 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in empresasFiltradas" :key="emp.id" class="border-b border-dark-700 hover:bg-dark-700/30">
            <td class="py-3 px-4 text-dark-300 font-mono">{{ emp.ruc }}</td>
            <td class="py-3 px-4 text-white">{{ emp.razon_social }}</td>
            <td class="py-3 px-4 text-dark-300">{{ emp.contacto?.email || '-' }}</td>
            <td class="py-3 px-4">
              <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Activa</span>
            </td>
            <td class="py-3 px-4">
              <button @click="editarEmpresa(emp)" class="text-blue-400 hover:text-blue-300 mr-3">Editar</button>
              <button @click="eliminarEmpresa(emp.id)" class="text-red-400 hover:text-red-300">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!empresasFiltradas.length">
            <td colspan="5" class="py-8 text-center text-dark-400">No hay empresas registradas</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="mostrarForm" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="cerrarForm">
      <div class="bg-[#1a1a1c] rounded-xl p-6 w-full max-w-md border border-neutral-800 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {{ editando ? 'Editar' : 'Nueva' }} Empresa
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-neutral-400 text-sm mb-1">RUC</label>
            <input v-model="formEmpresa.ruc" type="text" maxlength="11" class="w-full bg-[#0f0f11] text-white rounded-lg px-3 py-2 border border-neutral-700 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-1">Razón Social</label>
            <input v-model="formEmpresa.razon_social" type="text" class="w-full bg-[#0f0f11] text-white rounded-lg px-3 py-2 border border-neutral-700 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-1">Email de Contacto</label>
            <input v-model="formEmpresa.email" type="email" class="w-full bg-[#0f0f11] text-white rounded-lg px-3 py-2 border border-neutral-700 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-neutral-400 text-sm mb-1">Teléfono</label>
            <input v-model="formEmpresa.telefono" type="text" class="w-full bg-[#0f0f11] text-white rounded-lg px-3 py-2 border border-neutral-700 outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="cerrarForm" class="flex-1 py-2 bg-[#2a2a2d] text-neutral-300 rounded-lg hover:bg-neutral-700">Cancelar</button>
          <button @click="guardarEmpresa" :disabled="guardando" class="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const empresas = ref<any[]>([])
const busqueda = ref('')
const mostrarForm = ref(false)
const editando = ref<string | null>(null)
const guardando = ref(false)

const formEmpresa = ref({
  ruc: '',
  razon_social: '',
  email: '',
  telefono: ''
})

const empresasFiltradas = computed(() => {
  if (!busqueda.value) return empresas.value
  const q = busqueda.value.toLowerCase()
  return empresas.value.filter(e => 
    e.ruc.includes(q) || e.razon_social.toLowerCase().includes(q)
  )
})

async function cargarEmpresas() {
  try {
    const data = await $fetch<any[]>('/api/empresas')
    empresas.value = data || []
  } catch (e) {
    console.error('Error cargando empresas')
  }
}

function filtrar() {
  // Reactivo via computed
}

function editarEmpresa(emp: any) {
  editando.value = emp.id
  formEmpresa.value = {
    ruc: emp.ruc,
    razon_social: emp.razon_social,
    email: emp.contacto?.email || '',
    telefono: emp.contacto?.telefono || ''
  }
  mostrarForm.value = true
}

function cerrarForm() {
  mostrarForm.value = false
  editando.value = null
  formEmpresa.value = { ruc: '', razon_social: '', email: '', telefono: '' }
}

async function guardarEmpresa() {
  if (!formEmpresa.value.ruc || !formEmpresa.value.razon_social) {
    alert('RUC y Razón Social son requeridos')
    return
  }
  
  guardando.value = true
  try {
    const method = editando.value ? 'PUT' : 'POST'
    const url = editando.value ? `/api/empresas/${editando.value}` : '/api/empresas'
    
    await $fetch(url, {
      method,
      body: {
        ruc: formEmpresa.value.ruc,
        razon_social: formEmpresa.value.razon_social,
        contacto: {
          email: formEmpresa.value.email,
          telefono: formEmpresa.value.telefono
        }
      }
    })
    
    cerrarForm()
    await cargarEmpresas()
  } catch (e) {
    alert('Error al guardar')
  } finally {
    guardando.value = false
  }
}

async function eliminarEmpresa(id: string) {
  if (!confirm('¿Eliminar esta empresa?')) return
  
  try {
    await $fetch(`/api/empresas/${id}`, { method: 'DELETE' })
    await cargarEmpresas()
  } catch (e) {
    alert('Error al eliminar')
  }
}

onMounted(() => {
  cargarEmpresas()
})
</script>
