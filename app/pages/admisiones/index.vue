<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Admisiones</h1>
        <p class="text-dark-400">Punto de entrada para pacientes y gestión de citas</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <button class="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg hover:bg-dark-600 border border-dark-600">
          📅 Calendario
        </button>
        <NuxtLink to="/admisiones/empresas" class="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg hover:bg-dark-600 border border-dark-600">
          🏢 Empresas
        </NuxtLink>
        <NuxtLink 
          to="/admisiones/nueva" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Nueva Admisión
        </NuxtLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-dark-700">
      <button 
        @click="activeTab = 'estadisticas'" 
        :class="['pb-3 px-1 text-sm font-medium border-b-2 transition-colors', activeTab === 'estadisticas' ? 'border-blue-500 text-blue-400' : 'border-transparent text-dark-400 hover:text-dark-300']"
      >
        Estadísticas
      </button>
      <button 
        @click="activeTab = 'lista'" 
        :class="['pb-3 px-1 text-sm font-medium border-b-2 transition-colors', activeTab === 'lista' ? 'border-blue-500 text-blue-400' : 'border-transparent text-dark-400 hover:text-dark-300']"
      >
        Ver Lista
      </button>
    </div>

    <!-- Estadísticas Tab -->
    <div v-if="activeTab === 'estadisticas'">
      <!-- Resumen General -->
      <h2 class="text-lg font-semibold text-white mb-4">Resumen General</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div class="text-blue-400 text-xs uppercase mb-1 font-bold pl-2">HOY</div>
          <div class="text-3xl font-bold text-white pl-2">{{ stats.resumen?.hoy || 0 }}</div>
          <div class="text-neutral-500 text-sm pl-2">Admisiones</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
          <div class="text-purple-400 text-xs uppercase mb-1 font-bold pl-2">ESTA SEMANA</div>
          <div class="text-3xl font-bold text-white pl-2">{{ stats.resumen?.semana || 0 }}</div>
          <div class="text-neutral-500 text-sm pl-2">Admisiones</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <div class="text-emerald-400 text-xs uppercase mb-1 font-bold pl-2">ESTE MES</div>
          <div class="text-3xl font-bold text-white pl-2">{{ stats.resumen?.mes || 0 }}</div>
          <div class="text-neutral-500 text-sm pl-2">Admisiones</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 relative overflow-hidden group hover:border-pink-500/50 transition-all">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
          <div class="text-pink-400 text-xs uppercase mb-1 font-bold pl-2">TOTAL</div>
          <div class="text-3xl font-bold text-white pl-2">{{ stats.resumen?.total || 0 }}</div>
          <div class="text-neutral-500 text-sm pl-2">Admisiones</div>
        </div>
      </div>

      <!-- Por Estado -->
      <h2 class="text-lg font-semibold text-white mb-4">Por Estado</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
          <div class="w-10 h-10 mx-auto mb-2 bg-[#0f0f11] border border-neutral-700 rounded-full flex items-center justify-center">
            <span class="text-blue-400">📅</span>
          </div>
          <div class="text-neutral-500 text-xs mb-1">Programadas</div>
          <div class="text-2xl font-bold text-white">{{ stats.porEstado?.PROGRAMADO || 0 }}</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
          <div class="w-10 h-10 mx-auto mb-2 bg-[#0f0f11] border border-neutral-700 rounded-full flex items-center justify-center">
            <span class="text-green-400">✓</span>
          </div>
          <div class="text-neutral-500 text-xs mb-1">Confirmadas</div>
          <div class="text-2xl font-bold text-white">{{ stats.porEstado?.CONFIRMADO || 0 }}</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
          <div class="w-10 h-10 mx-auto mb-2 bg-[#0f0f11] border border-neutral-700 rounded-full flex items-center justify-center">
            <span class="text-yellow-400">⏳</span>
          </div>
          <div class="text-neutral-500 text-xs mb-1">En Proceso</div>
          <div class="text-2xl font-bold text-white">{{ stats.porEstado?.EN_PROCESO || 0 }}</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
          <div class="w-10 h-10 mx-auto mb-2 bg-[#0f0f11] border border-neutral-700 rounded-full flex items-center justify-center">
            <span class="text-teal-400">✅</span>
          </div>
          <div class="text-neutral-500 text-xs mb-1">Completadas</div>
          <div class="text-2xl font-bold text-white">{{ stats.porEstado?.COMPLETADO || 0 }}</div>
        </div>
        <div class="bg-[#1a1a1c] rounded-xl p-5 border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
          <div class="w-10 h-10 mx-auto mb-2 bg-[#0f0f11] border border-neutral-700 rounded-full flex items-center justify-center">
            <span class="text-red-400">✕</span>
          </div>
          <div class="text-neutral-500 text-xs mb-1">Canceladas</div>
          <div class="text-2xl font-bold text-white">{{ stats.porEstado?.CANCELADO || 0 }}</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
          <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Por Tipo de Examen (Top 5)
          </h3>
          <div class="space-y-3">
            <div v-for="item in stats.porTipoExamen" :key="item.tipo" class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-neutral-400 text-sm mb-1">{{ item.tipo }}</div>
                <div class="h-2 bg-[#0f0f11] border border-neutral-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-emerald-600 rounded-full" 
                    :style="{ width: getBarWidth(item.count, stats.porTipoExamen) }"
                  ></div>
                </div>
              </div>
              <div class="ml-4 text-right">
                <div class="text-white font-semibold">{{ item.count }}</div>
                <div class="text-neutral-500 text-xs">{{ getPercentage(item.count, stats.resumen?.total) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#1a1a1c] rounded-xl p-6 border border-neutral-800">
          <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Por Empresa (Top 5)
          </h3>
          <div class="space-y-3">
            <div v-for="item in stats.porEmpresa" :key="item.empresa" class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-neutral-400 text-sm mb-1">{{ item.empresa }}</div>
                <div class="h-2 bg-[#0f0f11] border border-neutral-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-emerald-600 rounded-full" 
                    :style="{ width: getBarWidth(item.count, stats.porEmpresa) }"
                  ></div>
                </div>
              </div>
              <div class="ml-4 text-right">
                <div class="text-white font-semibold">{{ item.count }}</div>
                <div class="text-neutral-500 text-xs">{{ getPercentage(item.count, stats.resumen?.total) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista Tab -->
    <div v-if="activeTab === 'lista'">
      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select v-model="filters.estado" class="bg-[#0f0f11] text-white rounded-lg px-4 py-2 border border-neutral-700 outline-none focus:border-emerald-500">
          <option value="TODOS">Todos los estados</option>
          <option value="PROGRAMADO">Programado</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Buscar por paciente o DNI..." 
          class="bg-[#0f0f11] text-white rounded-lg px-4 py-2 border border-neutral-700 flex-1 min-w-64 outline-none focus:border-emerald-500"
        />
        <button @click="fetchAdmisiones" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-600/20">
          Buscar
        </button>
      </div>

      <!-- Table -->
      <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-neutral-800 bg-[#0f0f11]">
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Fecha</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Paciente</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">DNI</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Empresa</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Tipo Examen</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Estado</th>
                <th class="text-left py-4 px-4 text-neutral-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="adm in admisiones" :key="adm.id" class="border-b border-neutral-800 hover:bg-[#2a2a2d]">
                <td class="py-3 px-4 text-neutral-300">{{ formatDate(adm.fecha) }}</td>
                <td class="py-3 px-4 text-white font-medium">{{ adm.paciente_nombre }}</td>
                <td class="py-3 px-4 text-neutral-300">{{ adm.dni }}</td>
                <td class="py-3 px-4 text-neutral-300">{{ adm.empresa }}</td>
                <td class="py-3 px-4 text-neutral-300">{{ adm.tipo_examen }}</td>
                <td class="py-3 px-4">
                  <span :class="getEstadoClass(adm.estado)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ adm.estado }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-emerald-400 hover:text-emerald-300 mr-2 font-medium">Ver</button>
                  <button class="text-neutral-400 hover:text-white">Editar</button>
                </td>
              </tr>
              <tr v-if="!admisiones.length">
                <td colspan="7" class="py-8 text-center text-neutral-500">No hay admisiones registradas</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-neutral-800">
          <div class="text-neutral-400 text-sm">
            Mostrando {{ admisiones.length }} de {{ pagination.total }} registros
          </div>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="pagination.page <= 1"
              class="px-3 py-1 bg-[#0f0f11] text-neutral-300 border border-neutral-700 rounded disabled:opacity-50 hover:bg-neutral-800"
            >
              Anterior
            </button>
            <span class="px-3 py-1 text-neutral-300">{{ pagination.page }} / {{ pagination.totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1 bg-[#0f0f11] text-neutral-300 border border-neutral-700 rounded disabled:opacity-50 hover:bg-neutral-800"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeTab = ref('estadisticas')

const stats = ref<any>({
  resumen: { hoy: 0, semana: 0, mes: 0, total: 0 },
  porEstado: {},
  porTipoExamen: [],
  porEmpresa: []
})

const admisiones = ref<any[]>([])
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
const filters = ref({ estado: 'TODOS', search: '' })

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getEstadoClass(estado: string) {
  const classes: Record<string, string> = {
    PROGRAMADO: 'bg-blue-500/20 text-blue-400',
    CONFIRMADO: 'bg-green-500/20 text-green-400',
    EN_PROCESO: 'bg-yellow-500/20 text-yellow-400',
    COMPLETADO: 'bg-teal-500/20 text-teal-400',
    CANCELADO: 'bg-red-500/20 text-red-400',
    PENDIENTE: 'bg-gray-500/20 text-gray-400'
  }
  return classes[estado] || classes.PENDIENTE
}

function getBarWidth(count: number, items: any[]) {
  const max = Math.max(...items.map((i: any) => i.count || 0), 1)
  return `${(count / max) * 100}%`
}

function getPercentage(count: number, total: number) {
  if (!total) return '0.0'
  return ((count / total) * 100).toFixed(1)
}

async function fetchStats() {
  try {
    const data = await $fetch('/api/reportes/stats')
    stats.value = data
  } catch (e) {
    console.error('Error fetching stats:', e)
  }
}

async function fetchAdmisiones() {
  try {
    const data = await $fetch<any>('/api/admisiones', {
      query: {
        estado: filters.value.estado,
        search: filters.value.search,
        page: pagination.value.page,
        limit: pagination.value.limit
      }
    })
    admisiones.value = data.data
    pagination.value = data.pagination
  } catch (e) {
    console.error('Error fetching admisiones:', e)
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchAdmisiones()
  }
}

function nextPage() {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    fetchAdmisiones()
  }
}

onMounted(() => {
  fetchStats()
  fetchAdmisiones()
})
</script>
