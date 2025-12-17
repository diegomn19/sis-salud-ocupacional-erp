<template>
  <div class="p-8 max-w-5xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold">Identificación Biométrica</h1>

    <!-- Info Alert -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex gap-3">
        <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="font-semibold text-blue-900">Módulo en Desarrollo</p>
          <p class="text-sm text-blue-800 mt-1">
            Esta es una demostración visual. La integración con lectores biométricos requiere hardware y drivers específicos.
          </p>
        </div>
      </div>
    </div>

    <!-- Scanner Simulation -->
    <section class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold">Escaneo de Huella Dactilar</h2>
      
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left: Scanner Visual -->
        <div class="flex-1">
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-center">
            <div class="inline-block p-8 bg-gray-700 rounded-lg mb-4">
              <svg class="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="#4F46E5" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M30 50 Q35 40, 40 50 T50 50 T60 50 T70 50" stroke="#4F46E5" stroke-width="2" fill="none"/>
                <path d="M30 60 Q35 50, 40 60 T50 60 T60 60 T70 60" stroke="#4F46E5" stroke-width="2" fill="none"/>
                <path d="M30 40 Q35 30, 40 40 T50 40 T60 40 T70 40" stroke="#4F46E5" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <p class="text-white text-sm">Coloque su dedo en el sensor</p>
            <p class="text-gray-400 text-xs mt-1">{{ estadoEscaneo }}</p>
          </div>
           
          <button
            @click="simularEscaneo"
            class="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
            :disabled="escaneando"
          >
            {{ escaneando ? 'Escaneando...' : 'Simular Escaneo' }}
          </button>
        </div>

        <!-- Right: Patient Info -->
        <div class="flex-1">
          <div v-if="pacienteIdentificado" class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="font-semibold text-green-900">✓ Paciente Identificado</p>
            </div>
            
            <div class="space-y-2">
              <div>
                <label class="text-xs text-gray-600">Nombre Completo</label>
                <p class="font-medium">{{ pacienteIdentificado.nombre }}</p>
              </div>
              <div>
                <label class="text-xs text-gray-600">DNI</label>
                <p class="font-medium">{{ pacienteIdentificado.dni }}</p>
              </div>
              <div>
                <label class="text-xs text-gray-600">Empresa</label>
                <p class="font-medium">{{ pacienteIdentificado.empresa }}</p>
              </div>
              <div>
                <label class="text-xs text-gray-600">Última Visita</label>
                <p class="font-medium">{{ pacienteIdentificado.ultimaVisita }}</p>
              </div>
            </div>

            <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Iniciar Atención
            </button>
          </div>
          
          <div v-else class="text-center text-gray-500 py-12">
            <svg class="w-16 h-16 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p>Esperando escaneo...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Registered Fingerprints -->
    <section class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-xl font-semibold">Huellas Registradas</h2>
      <p class="text-sm text-gray-600">
        Total de pacientes con huella biométrica registrada: <strong>243</strong>
      </p>
      
      <div class="flex gap-3">
        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          + Registrar Nueva Huella
        </button>
        <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          Ver Listado Completo
        </button>
      </div>
    </section>

    <!-- Technical Info -->
    <section class="bg-gray-50 rounded-lg p-6">
      <h3 class="font-semibold mb-2">Información Técnica</h3>
      <ul class="text-sm text-gray-700 space-y-1 list-disc list-inside">
        <li>Compatible con lectores USB estándar (DigitalPersona, ZKTeco, etc.)</li>
        <li>Almacenamiento encriptado de templates biométricos</li>
        <li>Velocidad de identificación: &lt;1 segundo</li>
        <li>Precisión: 99.9% (FAR 0.001%)</li>
        <li>Cumplimiento con normativas de protección de datos personales</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const escaneando = ref(false)
const estadoEscaneo = ref('Esperando...')
const pacienteIdentificado = ref(null as any)

function simularEscaneo() {
  escaneando.value = true
  estadoEscaneo.value = 'Capturando imagen...'
  
  setTimeout(() => {
    estadoEscaneo.value = 'Procesando...'
  }, 1000)
  
  setTimeout(() => {
    estadoEscaneo.value = 'Comparando con base de datos...'
  }, 2000)
  
  setTimeout(() => {
    estadoEscaneo.value = 'Identificación exitosa'
    pacienteIdentificado.value = {
      nombre: 'Juan Pérez Martínez',
      dni: '12345678',
      empresa: 'Minera del Sur SAC',
      ultimaVisita: '15/11/2025'
    }
    escaneando.value = false
  }, 3500)
}
</script>
