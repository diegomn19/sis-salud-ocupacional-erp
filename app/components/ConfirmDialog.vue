<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="cancel"
      >
        <div class="bg-[#1a1a1c] rounded-xl border border-neutral-800 shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
          <h3 class="text-lg font-bold mb-2 text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-red-500 rounded-full" v-if="confirmClass?.includes('red')"></span>
            <span class="w-1 h-6 bg-blue-500 rounded-full" v-else></span>
            {{ title }}
          </h3>
          <p class="text-neutral-300 mb-2">{{ message }}</p>
          <p v-if="detail" class="text-sm font-medium text-neutral-400 mb-6">{{ detail }}</p>
          <div class="flex gap-3 justify-end mt-6">
            <button
              @click="cancel"
              class="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2d] rounded-lg transition-colors border border-transparent hover:border-neutral-700"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              :class="[
                'px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all',
                confirmClass || 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message?: string
  detail?: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar',
  message: '¿Estás seguro?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar'
})

const emit = defineEmits<Emits>()

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
