<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p class="text-dark-400">Vista general del sistema</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Pacientes -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 hover:border-blue-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-500/10 rounded-lg">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.pacientes }}</div>
        <div class="text-sm text-neutral-400">Pacientes</div>
        <div class="mt-2 text-xs text-green-400">+12% este mes</div>
      </div>

      <!-- Admisiones -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 hover:border-green-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-500/10 rounded-lg">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.admisiones }}</div>
        <div class="text-sm text-neutral-400">Admisiones</div>
        <div class="mt-2 text-xs text-green-400">{{ stats.completadas }} completadas</div>
      </div>

      <!-- Conceptos Emitidos -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 hover:border-purple-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-500/10 rounded-lg">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.conceptos }}</div>
        <div class="text-sm text-neutral-400">Conceptos Emitidos</div>
        <div class="mt-2 text-xs text-purple-400">Este mes</div>
      </div>

      <!-- Ingresos -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800 hover:border-yellow-500 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">S/ {{ stats.ingresos.toLocaleString() }}</div>
        <div class="text-sm text-neutral-400">Ingresos del Mes</div>
        <div class="mt-2 text-xs text-yellow-400">+8% vs mes anterior</div>
      </div>
    </div>

    <!-- Secondary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Pendientes -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 hover:border-red-500 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-neutral-400 mb-1">Exámenes Pendientes</div>
            <div class="text-2xl font-bold text-white">{{ stats.pendientes }}</div>
          </div>
          <div class="p-3 bg-red-500/10 rounded-lg">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-red-400">Requieren atención</div>
      </div>

      <!-- Programadas -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 hover:border-cyan-500 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-neutral-400 mb-1">Programadas</div>
            <div class="text-2xl font-bold text-white">{{ stats.programadas }}</div>
          </div>
          <div class="p-3 bg-cyan-500/10 rounded-lg">
            <svg class="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-cyan-400">Próximos 7 días</div>
      </div>

      <!-- Completadas -->
      <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 hover:border-teal-500 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-neutral-400 mb-1">Completadas</div>
            <div class="text-2xl font-bold text-white">{{ stats.completadas }}</div>
          </div>
          <div class="p-3 bg-teal-500/10 rounded-lg">
            <svg class="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 text-xs text-teal-400">Este mes</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Admisiones Chart -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Admisiones Mensuales
          </h3>
          <select class="bg-[#0f0f11] text-white text-sm rounded-lg px-3 py-1.5 border border-neutral-700 outline-none">
            <option>Últimos 6 meses</option>
            <option>Este año</option>
          </select>
        </div>
        <div class="relative h-64 w-full">
          <canvas ref="admisionesChart" class="w-full"></canvas>
        </div>
      </div>

      <!-- Ingresos Chart -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Ingresos Mensuales
          </h3>
          <select class="bg-[#0f0f11] text-white text-sm rounded-lg px-3 py-1.5 border border-neutral-700 outline-none">
            <option>Últimos 6 meses</option>
            <option>Este año</option>
          </select>
        </div>
        <div class="relative h-64 w-full">
          <canvas ref="ingresosChart" class="w-full"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Admissions -->
      <div class="lg:col-span-2 bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Admisiones Recientes
          </h3>
          <NuxtLink to="/admisiones" class="text-sm text-emerald-400 hover:text-emerald-300">Ver todas →</NuxtLink>
        </div>
        <div class="space-y-3">
          <div v-for="admit in recentAdmissions" :key="admit.id" class="flex items-center justify-between p-3 bg-[#0f0f11] rounded-lg border border-neutral-800 hover:bg-[#2a2a2d] transition-colors">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {{ admit.iniciales }}
              </div>
              <div>
                <div class="text-sm font-medium text-white">{{ admit.paciente }}</div>
                <div class="text-xs text-neutral-400">{{ admit.dni }} • {{ admit.fecha }}</div>
              </div>
            </div>
            <span :class="[
              'text-xs px-2.5 py-1 rounded-full font-medium',
              admit.estado === 'programado' ? 'bg-blue-500/10 text-blue-400' :
              admit.estado === 'completado' ? 'bg-green-500/10 text-green-400' :
              'bg-yellow-500/10 text-yellow-400'
            ]">
              {{ admit.estadoLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Reports -->
      <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
        <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Acciones Rápidas
        </h3>
        <div class="space-y-3">
          <NuxtLink 
            to="/admisiones" 
            class="flex items-center space-x-3 p-3 bg-[#0f0f11] border border-neutral-800 rounded-lg hover:border-emerald-500/50 hover:bg-[#2a2a2d] transition-all group"
          >
            <div class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-neutral-300 group-hover:text-white">Nueva Admisión</span>
          </NuxtLink>

          <NuxtLink 
            to="/historia" 
            class="flex items-center space-x-3 p-3 bg-[#0f0f11] border border-neutral-800 rounded-lg hover:border-emerald-500/50 hover:bg-[#2a2a2d] transition-all group"
          >
            <div class="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-neutral-300 group-hover:text-white">Historia Clínica</span>
          </NuxtLink>

          <button 
            @click="generarReporte"
            class="w-full flex items-center space-x-3 p-3 bg-[#0f0f11] border border-neutral-800 rounded-lg hover:border-purple-500/50 hover:bg-[#2a2a2d] transition-all group"
          >
            <div class="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-neutral-300 group-hover:text-white">Generar Reporte</span>
          </button>

          <NuxtLink 
            to="/laboratorio" 
            class="flex items-center space-x-3 p-3 bg-[#0f0f11] border border-neutral-800 rounded-lg hover:border-cyan-500/50 hover:bg-[#2a2a2d] transition-all group"
          >
            <div class="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20">
              <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-neutral-300 group-hover:text-white">Laboratorio</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const admisionesChart = ref<HTMLCanvasElement>()
const ingresosChart = ref<HTMLCanvasElement>()

const stats = ref({
  pacientes: 0,
  admisiones: 0,
  conceptos: 0,
  ingresos: 0,
  pendientes: 0,
  programadas: 0,
  completadas: 0
})

const recentAdmissions = ref<any[]>([])

function generarReporte() {
  const startDate = '2025-01-01'
  const endDate = '2025-01-31'
  window.open(`/api/reportes/admisiones?fechaInicio=${startDate}&fechaFin=${endDate}`, '_blank')
}

async function fetchStats() {
  try {
    const data = await $fetch<any>('/api/reportes/stats')
    if (data.dashboard) {
      stats.value = data.dashboard
    }
    if (data.admisionesRecientes) {
      recentAdmissions.value = data.admisionesRecientes.map((a: any) => ({
        ...a,
        fecha: new Date(a.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
      }))
    }
  } catch (e) {
    console.error('Error fetching stats:', e)
  }
}

onMounted(async () => {
  await fetchStats()
  
  // Admisiones Chart
  if (admisionesChart.value) {
    new Chart(admisionesChart.value, {
      type: 'line',
      data: {
        labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
        datasets: [{
          label: 'Admisiones',
          data: [12, 15, 18, 20, 22, stats.value.admisiones],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    })
  }

  // Ingresos Chart
  if (ingresosChart.value) {
    new Chart(ingresosChart.value, {
      type: 'line',
      data: {
        labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
        datasets: [{
          label: 'Ingresos (S/)',
          data: [800, 950, 1100, 1050, 1200, stats.value.ingresos],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    })
  }
})
</script>
