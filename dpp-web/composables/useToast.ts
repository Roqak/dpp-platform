export const useToast = () => {
  const toast = useNotification()

  return {
    success: (message: string) => {
      toast.add({
        title: 'Success',
        description: message,
        icon: 'i-heroicons-check-circle',
        color: 'emerald',
      })
    },
    error: (message: string) => {
      toast.add({
        title: 'Error',
        description: message,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
    },
  }
}
