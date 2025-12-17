<template>
  <div class="max-w-4xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Nueva Admisión</h1>
        <p class="text-neutral-400 text-sm">Registro de paciente y servicio</p>
      </div>
      <NuxtLink to="/admisiones" class="text-neutral-400 hover:text-white transition-colors">← Cancelar</NuxtLink>
    </div>

    <!-- Stepper -->
    <div class="flex items-center justify-between mb-8 relative">
      <div class="absolute left-0 top-1/2 w-full h-0.5 bg-neutral-800 -z-10"></div>
      
      <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center gap-2 bg-[#0a0a0b] px-4">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"
          :class="currentStep > index + 1 ? 'bg-emerald-600 border-emerald-600 text-white' : 
                  currentStep === index + 1 ? 'border-emerald-500 text-emerald-500 bg-[#0a0a0b]' : 
                  'border-neutral-700 text-neutral-500 bg-[#0a0a0b]'"
        >
          <span v-if="currentStep > index + 1">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="text-xs font-medium" :class="currentStep === index + 1 ? 'text-white' : 'text-neutral-500'">{{ step }}</span>
      </div>
    </div>

    <!-- Step 1: Datos Generales -->
    <div v-show="currentStep === 1" class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 animate-fade-in">
      <h2 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Datos del Paciente y Servicio
      </h2>

      <!-- Paciente -->
      <div class="mb-8">
        <label class="block text-neutral-300 text-sm font-medium mb-2">Paciente</label>
        <div class="flex gap-2">
           <input 
            v-model="form.dni" 
            type="text" 
            maxlength="8"
            placeholder="Buscar por DNI..." 
            class="flex-1 bg-[#0f0f11] text-white rounded-lg px-4 py-2.5 border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-neutral-600"
            @keyup.enter="buscarPaciente"
            :disabled="!!paciente"
          />
          <button v-if="!paciente" @click="buscarPaciente" :disabled="buscando" class="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium shadow-lg shadow-emerald-600/20 transition-all">
            {{ buscando ? '...' : 'Buscar' }}
          </button>
          <button v-if="!paciente" @click="abrirModalPaciente" class="px-5 py-2.5 bg-[#0a0a0b] text-emerald-400 border border-neutral-700 rounded-lg hover:bg-[#2a2a2d] hover:text-emerald-300 transition-colors">
            + Nuevo
          </button>
          <button v-if="paciente" @click="limpiarPaciente" class="px-4 py-2.5 text-neutral-400 hover:text-white bg-[#0a0a0b] border border-neutral-700 rounded-lg">
            Cambiar
          </button>
        </div>
        
        <!-- Tarjeta Paciente -->
        <div v-if="paciente" class="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 flex justify-between items-start">
          <div>
            <h3 class="text-white font-medium">{{ paciente.nombre }}</h3>
            <p class="text-neutral-400 text-sm mt-1">DNI: <span class="text-emerald-400 font-mono">{{ paciente.dni }}</span></p>
            <p class="text-neutral-400 text-sm">Empresa: {{ paciente.empresa || 'Particular' }}</p>
          </div>
          <div class="text-right">
            <span class="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Activo</span>
          </div>
        </div>
        <p v-if="errorPaciente" class="mt-2 text-red-400 text-sm">{{ errorPaciente }}</p>
      </div>

      <!-- Servicios -->
      <div class="mb-8">
        <label class="block text-neutral-300 text-sm font-medium mb-3">Servicio / Tipo de Examen</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            v-for="servicio in listaServicios" 
            :key="servicio.id"
            @click="seleccionarServicio(servicio)"
            class="text-left p-4 rounded-lg border transition-all relative overflow-hidden group"
            :class="form.servicioId === servicio.id ? 'bg-emerald-600/10 border-emerald-500 ring-1 ring-emerald-500/20' : 'bg-[#0f0f11] border-neutral-700 hover:border-neutral-500'"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="font-medium" :class="form.servicioId === servicio.id ? 'text-emerald-400' : 'text-white'">{{ servicio.nombre }}</span>
              <span class="text-xs font-mono bg-[#0a0a0b] px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">{{ servicio.codigo }}</span>
            </div>
            <p class="text-xs text-neutral-500 line-clamp-2 mb-3">{{ servicio.descripcion }}</p>
            <div class="flex items-center justify-between text-xs">
              <span class="text-neutral-400 flex items-center gap-1">
                ⏱ {{ servicio.duracion_min }} min
              </span>
              <span class="font-bold text-sm" :class="form.servicioId === servicio.id ? 'text-emerald-300' : 'text-neutral-300'">
                S/ {{ Number(servicio.precio).toFixed(2) }}
              </span>
            </div>
          </button>
        </div>
        <div v-if="listaServicios.length === 0" class="text-neutral-500 text-sm py-4 text-center">Cargando servicios...</div>
      </div>

      <!-- Fecha -->
      <div class="mb-6">
        <label class="block text-neutral-300 text-sm font-medium mb-2">Fecha y Hora Programada</label>
        <div class="relative">
          <input 
            v-model="form.fechaCita" 
            type="datetime-local" 
            class="w-full bg-[#0f0f11] text-white rounded-lg px-4 py-2.5 border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all calendar-dark"
          />
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button 
          @click="currentStep++" 
          :disabled="!isStep1Valid"
          class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>

    <!-- Step 2: Documentos -->
    <div v-show="currentStep === 2" class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 animate-fade-in">
      <h2 class="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Documentos Requeridos
      </h2>
      <p class="text-neutral-400 text-sm mb-6">Puede subir documentos ahora o después de crear la admisión. (Opcional)</p>

      <div class="space-y-4">
        <div v-for="docType in documentTypes" :key="docType.id" class="bg-[#0f0f11] p-4 rounded-lg border border-neutral-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-white">{{ docType.label }}</span>
            <span v-if="getFile(docType.id)" class="text-xs text-emerald-400 flex items-center gap-1">
              ✓ {{ getFileName(docType.id) }}
              <button @click="removeFile(docType.id)" class="text-red-400 hover:text-red-300 ml-2">✕</button>
            </span>
            <span v-else class="text-xs text-neutral-600 italic">Ningún archivo seleccionado</span>
          </div>
          <div class="relative">
            <input 
              type="file" 
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @change="(e) => handleFileUpload(e, docType.id)"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div class="w-full bg-[#1a1a1c] border border-dashed border-neutral-700 text-neutral-400 rounded-lg py-2 px-4 text-sm text-center hover:border-emerald-500/50 hover:text-emerald-500 transition-colors pointer-events-none">
              {{ uploading[docType.id] ? 'Subiendo...' : 'Seleccionar archivo' }}
            </div>
          </div>
        </div>
      </div>
       
      <div class="flex justify-between pt-8 mt-4 border-t border-neutral-800">
        <button @click="currentStep--" class="px-6 py-2.5 text-neutral-400 hover:text-white border border-neutral-700 rounded-lg hover:bg-[#2a2a2d] transition-colors">
          Atrás
        </button>
        <button 
          @click="currentStep++" 
          class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>

    <!-- Step 3: Confirmación -->
    <div v-show="currentStep === 3" class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 animate-fade-in">
      <h2 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
        Confirmación y Facturación
      </h2>

      <!-- Resumen -->
      <div class="bg-gradient-to-br from-[#0f0f11] to-[#151518] rounded-xl p-5 border border-neutral-800 mb-6">
        <h3 class="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">Resumen</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-neutral-400">Paciente:</span>
            <span class="text-white font-medium">{{ paciente?.nombre }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-400">DNI:</span>
            <span class="text-white font-mono">{{ paciente?.dni }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-400">Tipo de Examen:</span>
             <span class="text-emerald-400 font-medium">{{ selectedService?.nombre }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-400">Código:</span>
            <span class="text-neutral-300 font-mono">{{ selectedService?.codigo }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-400">Fecha y Hora:</span>
            <span class="text-white">{{ form.fechaCita.replace('T', ' ') }}</span>
          </div>
        </div>
      </div>

      <!-- Facturación -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-neutral-300">Tipo de Comprobante *</label>
          <select v-model="form.tipoComprobante" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-emerald-500">
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
          </select>
        </div>
         <div>
          <label class="block text-sm font-medium mb-1.5 text-neutral-300">Método de Pago *</label>
          <select v-model="form.metodoPago" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-emerald-500">
            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia Bancaria</option>
            <option value="Yape/Plin">Billetera Digital (Yape/Plin)</option>
          </select>
        </div>
      </div>

       <div class="flex justify-between pt-4 border-t border-neutral-800">
        <button @click="currentStep--" class="px-6 py-2.5 text-neutral-400 hover:text-white border border-neutral-700 rounded-lg hover:bg-[#2a2a2d] transition-colors">
          Atrás
        </button>
        <button 
          @click="crearAdmision" 
          :disabled="guardando"
          class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <span v-if="guardando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ guardando ? 'Procesando...' : 'Confirmar y Crear Admisión' }}
        </button>
      </div>
    </div>

    <!-- Modal Nuevo Paciente (Reused) -->
    <Teleport to="body">
      <div v-if="mostrarModalPaciente" class="fixed inset-0 bg-[#0a0a0b]/90 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
        <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-2xl w-full mx-4 my-8 relative">
           <button @click="mostrarModalPaciente = false" class="absolute top-4 right-4 text-neutral-500 hover:text-white">✕</button>
           <h3 class="text-xl font-bold mb-6 text-white border-b border-neutral-800 pb-2">Registrar Nuevo Paciente</h3>
          <!-- Form content same as before but cleaner layout -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label class="text-xs text-neutral-400 block mb-1">DNI *</label>
               <div class="flex gap-2">
                 <input v-model="formPaciente.dni" type="text" maxlength="8" class="flex-1 bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" @blur="buscarReniec" />
                 <button @click="buscarReniec" :disabled="buscandoReniec" class="bg-emerald-600 text-white px-3 rounded-lg text-xs">{{ buscandoReniec ? '...' : 'RENIEC' }}</button>
               </div>
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Nombres *</label>
               <input v-model="formPaciente.nombres" type="text" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Apellidos *</label>
               <input v-model="formPaciente.apellidos" type="text" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Email</label>
               <input v-model="formPaciente.email" type="email" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Teléfono</label>
               <input v-model="formPaciente.telefono" type="tel" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Empresa</label>
               <select v-model="formPaciente.empresaId" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none">
                 <option value="">Particular</option>
                 <option v-for="emp in listaEmpresas" :key="emp.id" :value="emp.id">{{ emp.razon_social }}</option>
               </select>
             </div>
             <div>
               <label class="text-xs text-neutral-400 block mb-1">Fecha Nacimiento</label>
               <input v-model="formPaciente.fechaNac" type="date" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
                <label class="text-xs text-neutral-400 block mb-1">Sexo</label>
                <select v-model="formPaciente.sexo" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
             </div>
             <div>
                <label class="text-xs text-neutral-400 block mb-1">Tipo Sangre</label>
                <select v-model="formPaciente.tipoSangre" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none">
                  <option value="">-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
             </div>
             <div class="col-span-1 md:col-span-2">
               <label class="text-xs text-neutral-400 block mb-1">Alergias</label>
               <textarea v-model="formPaciente.alergias" rows="2" class="w-full bg-[#0f0f11] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none resize-none"></textarea>
             </div>
           </div>
           <div class="mt-6 flex justify-end gap-3">
             <button @click="mostrarModalPaciente = false" class="px-4 py-2 text-neutral-400 hover:text-white bg-[#2a2a2d] rounded-lg">Cancelar</button>
             <button @click="guardarPaciente" :disabled="guardandoPaciente" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{{ guardandoPaciente ? 'Guardando...' : 'Guardar' }}</button>
           </div>
        </div>
      </div>
    </Teleport>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MessageDialog from '~/components/MessageDialog.vue'

const router = useRouter()
const currentStep = ref(1)
const steps = ['Datos Generales', 'Documentos', 'Confirmación']

// State
const listaServicios = ref<any[]>([])
const listaEmpresas = ref<any[]>([])
const paciente = ref<any>(null)
const errorPaciente = ref('')
const buscando = ref(false)
const guardando = ref(false)

// Form
const form = ref({
  dni: '',
  servicioId: '',
  fechaCita: '',
  observaciones: '',
  tipoComprobante: 'Boleta',
  metodoPago: 'Tarjeta',
  archivos: [] as any[]
})

// Validation
const isStep1Valid = computed(() => {
  return paciente.value && form.value.servicioId && form.value.fechaCita
})

const selectedService = computed(() => listaServicios.value.find(s => s.id === form.value.servicioId))

// Documents logic
const documentTypes = [
  { id: 'dni', label: 'DNI' },
  { id: 'carnet', label: 'Carnet de Salud' },
  { id: 'historia', label: 'Historia Clínica' },
  { id: 'examenes', label: 'Exámenes Previos' },
  { id: 'otros', label: 'Otros Documentos' }
]

const uploading = ref<Record<string, boolean>>({})

function getFile(typeId: string) {
  return form.value.archivos.find(f => f.typeId === typeId)
}
function getFileName(typeId: string) {
  return getFile(typeId)?.nombre
}
function removeFile(typeId: string) {
  form.value.archivos = form.value.archivos.filter(f => f.typeId !== typeId)
}

async function handleFileUpload(event: Event, typeId: string) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)
  
  uploading.value[typeId] = true
  try {
    const res = await $fetch<any>('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (res.ok && res.files?.[0]) {
      // Remove previous file of this type if exists
      removeFile(typeId)
      form.value.archivos.push({
        typeId, // Internal tag to know which slot
        nombre: res.files[0].nombre,
        url: res.files[0].url,
        size: res.files[0].size
      })
    }
  } catch (e) {
    console.error('Error uploading', e)
    showMessage('Error', 'No se pudo subir el archivo', 'error')
  } finally {
    uploading.value[typeId] = false
    input.value = '' // Clear input
  }
}

// Global Message
const messageState = ref({ isOpen: false, title: '', message: '', type: 'info' as 'info'|'success'|'error' })
function showMessage(title: string, message: string, type: 'info'|'success'|'error' = 'info') {
  messageState.value = { isOpen: true, title, message, type }
}

onMounted(async () => {
    cargarEmpresas()
    // Fetch Services
    try {
        const res = await $fetch<any>('/api/servicios')
        listaServicios.value = res.data || []
    } catch(e) { console.error(e) }
})

// ... Reused Functions (buscarPaciente, guardarPaciente, etc) ...

// Modal
const mostrarModalPaciente = ref(false)
const guardandoPaciente = ref(false)
const buscandoReniec = ref(false)
const formPaciente = ref({
  dni: '', nombres: '', apellidos: '', email: '', telefono: '', 
  fechaNac: '', sexo: 'M', tipoSangre: '', alergias: '', empresaId: '' 
})

async function cargarEmpresas() {
  try {
    const res = await $fetch<any>('/api/empresas')
    listaEmpresas.value = Array.isArray(res) ? res : (res.data || [])
  } catch (e) { console.error(e) }
}

async function buscarReniec() {
  const dni = formPaciente.value.dni
  if (!dni || dni.length !== 8) return
  buscandoReniec.value = true
  try {
    const res = await $fetch<any>('/api/reniec/consulta', { method: 'POST', body: { dni } })
    if (res.ok && res.data) {
      formPaciente.value.nombres = res.data.nombres || ''
      formPaciente.value.apellidos = res.data.apellidos || ''
      if (res.data.fechaNacimiento) formPaciente.value.fechaNac = res.data.fechaNacimiento 
    }
  } catch(e) { console.error(e) } finally { buscandoReniec.value = false }
}

async function buscarPaciente() {
  if (form.value.dni.length !== 8) return
  buscando.value = true; paciente.value = null; errorPaciente.value = ''
  try {
    const res = await $fetch<any>('/api/pacientes/search', { query: { dni: form.value.dni } })
    if (res.found && res.usuario?.pacientes?.[0]) {
      paciente.value = {
        id: res.usuario.pacientes[0].id,
        nombre: res.usuario.nombre,
        dni: res.usuario.dni,
        empresa: res.usuario.pacientes[0].empresas?.razon_social
      }
    } else { errorPaciente.value = 'Paciente no encontrado.' }
  } catch(e) { errorPaciente.value = 'Error en búsqueda' } finally { buscando.value = false }
}

function limpiarPaciente() {
  paciente.value = null
  form.value.dni = ''
}

function abrirModalPaciente() {
  formPaciente.value = { dni: form.value.dni || '', nombres: '', apellidos: '', email: '', telefono: '', fechaNac: '', sexo: 'M', tipoSangre: '', alergias: '', empresaId: '' }
  mostrarModalPaciente.value = true
}

async function guardarPaciente() {
    // Basic validation
    if(!formPaciente.value.dni) return showMessage('Error', 'DNI requerido', 'error')
    
    guardandoPaciente.value = true
    try {
        const res = await $fetch<any>('/api/pacientes', { method: 'POST', body: formPaciente.value })
        if (res.ok) {
            paciente.value = res.paciente
            form.value.dni = res.paciente.dni
            mostrarModalPaciente.value = false
            showMessage('Éxito', 'Paciente creado', 'success')
        } else showMessage('Error', res.message, 'error')
    } catch(e) { showMessage('Error', 'Error interno', 'error') } 
    finally { guardandoPaciente.value = false }
}

function seleccionarServicio(servicio: any) {
    form.value.servicioId = servicio.id
}

async function crearAdmision() {
    if (!paciente.value || !form.value.servicioId) return
    guardando.value = true
    try {
        const res = await $fetch<any>('/api/admisiones', {
            method: 'POST',
            body: {
                pacienteId: paciente.value.id,
                servicioId: form.value.servicioId,
                fechaCita: form.value.fechaCita,
                observaciones: form.value.observaciones,
                tipoComprobante: form.value.tipoComprobante,
                metodoPago: form.value.metodoPago,
                archivos: form.value.archivos
            }
        })
        if (res.ok) {
            showMessage('Éxito', 'Admisión Creada Correctamente', 'success')
            setTimeout(() => router.push('/admisiones'), 2000)
        } else {
            showMessage('Error', res.message, 'error')
        }
    } catch(e) { showMessage('Error', 'Error de red', 'error') } finally { guardando.value = false }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.calendar-dark::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
</style>
