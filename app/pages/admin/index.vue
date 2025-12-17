<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-white">Administración del Sistema</h1>

    <!-- Gestión de Usuarios -->
    <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
          Gestión de Usuarios
        </h2>
        <button @click="abrirModalUsuario()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Nuevo Usuario
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-400 uppercase bg-[#0f0f11] border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3">Nombre</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Rol</th>
              <th class="px-6 py-3">Estado</th>
              <th class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d]">
              <td class="px-6 py-4 font-medium text-white">{{ user.nombre }}</td>
              <td class="px-6 py-4 text-gray-400">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                  {{ user.rol }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="user.activo ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button @click="editarUsuario(user)" class="text-blue-400 hover:text-blue-300 mr-2">Editar</button>
                <button class="text-red-400 hover:text-red-300">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Configuración del Sistema -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
        <h2 class="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
          Respaldo de Base de Datos
        </h2>
        <p class="text-neutral-400 text-sm mb-4">Genera copias de seguridad manuales o configura respaldos automáticos.</p>
        <div class="space-y-4">
          <button class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
            <span>💾</span> Generar Backup Ahora
          </button>
          <div class="flex items-center justify-between p-3 bg-[#0f0f11] rounded-lg border border-neutral-700">
            <span class="text-sm text-gray-300">Respaldo Automático (Diario)</span>
            <div class="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer">
              <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#1a1a1c] rounded-xl border border-neutral-800 p-6">
        <h2 class="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
          Integraciones API
        </h2>
        <p class="text-neutral-400 text-sm mb-4">Gestiona las llaves de acceso para servicios externos.</p>
        <div class="space-y-3">
          <div>
             <label class="text-xs text-neutral-500 uppercase font-semibold">Reniec API Key</label>
             <div class="flex gap-2">
               <input type="password" value="******************" class="flex-1 bg-[#0f0f11] border border-neutral-700 rounded px-3 py-1.5 text-white text-sm" readonly />
               <button class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Cambiar</button>
             </div>
          </div>
          <div>
             <label class="text-xs text-neutral-500 uppercase font-semibold">WhatsApp API Token</label>
             <div class="flex gap-2">
               <input type="password" value="******************" class="flex-1 bg-[#0f0f11] border border-neutral-700 rounded px-3 py-1.5 text-white text-sm" readonly />
               <button class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Cambiar</button>
             </div>
          </div>
        </div>
      </section>
    </div>

    <div class="pt-4">
        <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-900/20">
          Guardar Configuración
        </button>
    </div>

    <!-- Modal Usuario -->
    <Teleport to="body">
      <div v-if="mostrarModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
          <h3 class="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            {{ editMode ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-neutral-300">Nombre Completo</label>
              <input v-model="formUser.nombre" type="text" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-neutral-300">Correo Electrónico</label>
              <input v-model="formUser.email" type="email" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-neutral-300">Rol</label>
              <select v-model="formUser.rol" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500">
                <option value="ADMIN">Administrador</option>
                <option value="MEDICO">Médico</option>
                <option value="ADMISION">Admisión</option>
                <option value="LOGISTICA">Logística</option>
              </select>
            </div>

             <div class="flex justify-end gap-3 mt-6">
              <button @click="cerrarModal" class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Cancelar
              </button>
              <button @click="guardarUsuario" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                Guardar Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  {
    id: '1',
    nombre: 'Dr. Carlos Mendoza',
    dni: '12345678',
    rol: 'MEDICO',
    email: 'carlos@ejemplo.com',
    activo: true
  },
  {
    id: '2',
    nombre: 'Ana García',
    dni: '87654321',
    rol: 'ADMISIONES',
    email: 'ana@ejemplo.com',
    activo: true
  },
  {
    id: '3',
    nombre: 'Luis Torres',
    dni: '11223344',
    rol: 'LAB',
    email: 'luis@ejemplo.com',
    activo: false
  }
])

const config = ref({
  nombreClinica: 'Centro de Salud Ocupacional',
  ruc: '20123456789',
  direccion: 'Av. Principal 123, Lima',
  telefono: '+51 1 234-5678'
})

// Modal logic
const mostrarModal = ref(false)
const editMode = ref(false)
const formUser = ref({
  nombre: '',
  email: '',
  rol: 'MEDICO'
})

function abrirModalUsuario() {
  editMode.value = false
  formUser.value = { nombre: '', email: '', rol: 'MEDICO' }
  mostrarModal.value = true
}

function editarUsuario(user: any) {
  editMode.value = true
  formUser.value = { ...user }
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

function guardarUsuario() {
  // Logic to save user
  if (editMode.value) {
    // Update existing
    // ...
  } else {
    // Create new
    // ...
  }
  mostrarModal.value = false
}
</script>
