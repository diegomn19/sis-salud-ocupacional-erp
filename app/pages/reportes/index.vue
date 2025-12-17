<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Reportes</h1>
      <p class="text-dark-400 text-sm">Generación de informes y estadísticas</p>
    </div>

    <!-- Report Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <!-- Reporte Admisiones -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <span class="text-blue-400 text-xl">📋</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Admisiones por Rango</h3>
            <p class="text-neutral-400 text-xs">Lista de admisiones por fecha</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-neutral-400 text-xs text-secondary">Desde</label>
            <input v-model="filtros.admisiones.desde" type="date" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="text-neutral-400 text-xs text-secondary">Hasta</label>
            <input v-model="filtros.admisiones.hasta" type="date" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="generarReporteAdmisiones(false)" class="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Ver PDF
            </button>
            <button @click="generarReporteAdmisiones(true)" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
              <span>📥</span> Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Reporte Conceptos Aptitud -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
            <span class="text-green-400 text-xl">✅</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Conceptos de Aptitud</h3>
            <p class="text-neutral-400 text-xs">Certificados emitidos</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-neutral-400 text-xs">Desde</label>
            <input v-model="filtros.conceptos.desde" type="date" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-green-500" />
          </div>
          <div>
            <label class="text-neutral-400 text-xs">Hasta</label>
            <input v-model="filtros.conceptos.hasta" type="date" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-green-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="generarReporteConceptos(false)" class="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              Ver PDF
            </button>
            <button @click="generarReporteConceptos(true)" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
              <span>📥</span> Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Reporte Ingresos -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
            <span class="text-yellow-400 text-xl">💰</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Ingresos</h3>
            <p class="text-neutral-400 text-xs">Facturación y pagos</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-neutral-400 text-xs text-secondary">Mes</label>
            <input v-model="filtros.ingresos.mes" type="month" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-yellow-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="generarReporteIngresos(false)" class="w-full py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors">
              Ver PDF
            </button>
            <button @click="generarReporteIngresos(true)" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
              <span>📥</span> Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Reporte por Empresa -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
            <span class="text-purple-400 text-xl">🏢</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Por Empresa</h3>
            <p class="text-neutral-400 text-xs">Admisiones por empresa</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-neutral-400 text-xs text-secondary">Empresa</label>
            <select v-model="filtros.empresa.id" class="w-full bg-[#0f0f11] text-white rounded px-3 py-1.5 text-sm border border-neutral-700 outline-none focus:border-purple-500">
              <option value="">Todas</option>
              <option v-for="emp in empresas" :key="emp.id" :value="emp.id">{{ emp.razon_social }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="generarReporteEmpresa(false)" class="w-full py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
              Ver PDF
            </button>
            <button @click="generarReporteEmpresa(true)" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
              <span>📥</span> Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas Generales -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
            <span class="text-cyan-400 text-xl">📊</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Estadísticas</h3>
            <p class="text-neutral-400 text-xs">Resumen general del sistema</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <button @click="generarEstadisticas(false)" class="w-full py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition-colors">
              Ver PDF
            </button>
            <button @click="generarEstadisticas(true)" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-white rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors flex items-center justify-center gap-2">
              <span>📥</span> Descargar
            </button>
        </div>
      </div>

      <!-- Exportar CSV -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center border border-gray-500/20">
            <span class="text-gray-400 text-xl">📥</span>
          </div>
          <div>
            <h3 class="text-white font-medium">Exportar Datos</h3>
            <p class="text-neutral-400 text-xs">Descargar en CSV/Excel</p>
          </div>
        </div>
        <div class="space-y-2">
          <button @click="exportarCSV('admisiones')" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-neutral-300 rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors">
            Admisiones CSV
          </button>
          <button @click="exportarCSV('pacientes')" class="w-full py-2 bg-[#0f0f11] border border-neutral-700 text-neutral-300 rounded-lg text-sm hover:bg-[#2a2a2d] transition-colors">
            Pacientes CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const empresas = ref<any[]>([])

const today = new Date().toISOString().slice(0, 10)
const monthStart = new Date().toISOString().slice(0, 7)

const filtros = ref({
  admisiones: { desde: today, hasta: today },
  conceptos: { desde: today, hasta: today },
  ingresos: { mes: monthStart },
  empresa: { id: '' }
})

async function cargarEmpresas() {
  try {
    empresas.value = await $fetch<any[]>('/api/empresas')
  } catch (e) {
    console.error('Error cargando empresas')
  }
}

function generarReporteAdmisiones(download = false) {
  const { desde, hasta } = filtros.value.admisiones
  const url = `/api/reportes/admisiones-pdf?desde=${desde}&hasta=${hasta}`
  if (download) {
    // Para descargar, usamos un link temporal o window.location si el backend fuerza header attachment
    // Por ahora simularemos comportamiento en misma pestaña o nueva pero que deberia descargar
    // En real apps, el backend debe poner Content-Disposition: attachment
    const link = document.createElement('a')
    link.href = url + '&download=true'
    link.target = '_blank'
    link.download = `admisiones_${desde}_${hasta}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(url, '_blank')
  }
}

function generarReporteConceptos(download = false) {
  const { desde, hasta } = filtros.value.conceptos
  const url = `/api/reportes/conceptos-pdf?desde=${desde}&hasta=${hasta}`
  if (download) {
    const link = document.createElement('a')
    link.href = url + '&download=true'
    link.target = '_blank'
    link.download = `conceptos_${desde}_${hasta}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(url, '_blank')
  }
}

function generarReporteIngresos(download = false) {
  const url = `/api/reportes/ingresos-pdf?mes=${filtros.value.ingresos.mes}`
  if (download) {
    const link = document.createElement('a')
    link.href = url + '&download=true'
    link.target = '_blank'
    link.download = `ingresos_${filtros.value.ingresos.mes}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(url, '_blank')
  }
}

function generarReporteEmpresa(download = false) {
  const url = `/api/reportes/empresa-pdf?empresaId=${filtros.value.empresa.id}`
  if (download) {
    const link = document.createElement('a')
    link.href = url + '&download=true'
    link.target = '_blank'
    link.download = `reporte_empresa_${filtros.value.empresa.id || 'todas'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(url, '_blank')
  }
}

function generarEstadisticas(download = false) {
  const url = '/api/reportes/estadisticas-pdf'
  if (download) {
    const link = document.createElement('a')
    link.href = url + '?download=true'
    link.target = '_blank'
    link.download = 'estadisticas_generales.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(url, '_blank')
  }
}

function exportarCSV(tipo: string) {
  window.open(`/api/reportes/export-csv?tipo=${tipo}`, '_blank')
}

onMounted(() => {
  cargarEmpresas()
})
</script>
