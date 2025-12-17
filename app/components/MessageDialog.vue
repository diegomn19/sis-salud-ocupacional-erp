<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]"
        @click.self="close"
      >
        <div class="bg-dark-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-dark-700 transform transition-all">
          
          <!-- Icon -->
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4" :class="iconBgClass">
            <svg v-if="type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <svg v-else-if="type === 'error'" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <svg v-else class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="text-center">
            <h3 class="text-lg font-bold text-white mb-2">{{ title }}</h3>
            <p class="text-sm text-dark-300">{{ message }}</p>
          </div>

          <!-- Button -->
          <div class="mt-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
              :class="buttonClass"
              @click="close"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  message?: string
  type?: 'success' | 'error' | 'info'
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Mensaje',
  type: 'info',
  buttonText: 'Aceptar'
})

const emit = defineEmits(['close'])

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-900/30'
    case 'error': return 'bg-red-900/30'
    default: return 'bg-blue-900/30'
  }
})

const buttonClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-600 hover:bg-green-500 text-white'
    case 'error': return 'bg-red-600 hover:bg-red-500 text-white'
    default: return 'bg-blue-600 hover:bg-blue-500 text-white'
  }
})

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
