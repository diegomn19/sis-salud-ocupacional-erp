# Reusable Confirmation Modal

## Usage

The `ConfirmDialog` component and `useConfirmDialog` composable provide a consistent, styled confirmation modal for all pages.

### Basic Example

```vue
<template>
  <div>
    <button @click="handleDelete">Delete Item</button>
    
    <ConfirmDialog
      :is-open="confirmDialog.isOpen.value"
      :title="confirmDialog.options.value.title"
      :message="confirmDialog.options.value.message"
      :detail="confirmDialog.options.value.detail"
      :confirm-text="confirmDialog.options.value.confirmText"
      :cancel-text="confirmDialog.options.value.cancelText"
      @confirm="confirmDialog.confirm"
      @cancel="confirmDialog.cancel"
    />
  </div>
</template>

<script setup lang="ts">
const confirmDialog = useConfirmDialog()

async function handleDelete() {
  confirmDialog.show(
    {
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      detail: 'Item name here', // Optional
      confirmText: 'Delete',
      cancelText: 'Cancel'
    },
    async () => {
      // This function runs when user clicks confirm
      await deleteItem()
    }
  )
}
</script>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | 'Confirmar' | Modal title |
| `message` | string | '¿Estás seguro?' | Main message |
| `detail` | string | undefined | Optional detail text (e.g., item name) |
| `confirmText` | string | 'Confirmar' | Confirm button text |
| `cancelText` | string | 'Cancelar' | Cancel button text |
| `confirmClass` | string | 'bg-red-600 hover:bg-red-700' | Custom button classes |

### Custom Styling Example

```typescript
confirmDialog.show(
  {
    title: 'Activate Feature',
    message: 'Enable this feature for all users?',
    confirmText: 'Activate',
    confirmClass: 'bg-green-600 hover:bg-green-700'
  },
  async () => {
    await activateFeature()
  }
)
```
