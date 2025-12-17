<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :class="[
        'block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out sm:text-sm',
        theme === 'dark' 
          ? 'bg-dark-900 border-dark-700 text-white focus:border-blue-500 focus:ring-blue-500' 
          : 'bg-white border-gray-300 text-gray-900 focus:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      ]"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  theme: {
    type: String,
    default: 'dark', // Default to dark as requested in the context of the app's dark mode
    validator: (value: string) => ['light', 'dark'].includes(value)
  }
})

defineEmits(['update:modelValue'])
</script>
