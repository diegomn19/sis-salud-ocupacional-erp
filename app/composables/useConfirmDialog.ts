import { ref } from 'vue'

interface ConfirmOptions {
    title?: string
    message?: string
    detail?: string
    confirmText?: string
    cancelText?: string
    confirmClass?: string
}

export function useConfirmDialog() {
    const isOpen = ref(false)
    const options = ref<ConfirmOptions>({})
    const onConfirmCallback = ref<(() => void) | null>(null)

    function show(opts: ConfirmOptions, onConfirm: () => void) {
        options.value = opts
        onConfirmCallback.value = onConfirm
        isOpen.value = true
    }

    function confirm() {
        if (onConfirmCallback.value) {
            onConfirmCallback.value()
        }
        close()
    }

    function cancel() {
        close()
    }

    function close() {
        isOpen.value = false
        options.value = {}
        onConfirmCallback.value = null
    }

    return {
        isOpen,
        options,
        show,
        confirm,
        cancel
    }
}
