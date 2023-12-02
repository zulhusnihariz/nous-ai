import { useCallback } from 'react'
import { useBoundStore } from 'store'

const useClipboard = () => {
  const { setModalState } = useBoundStore()

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setModalState({ alert: { isOpen: true, state: 'success', message: 'Copied' } })
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    },
    [setModalState]
  )

  return copyToClipboard
}

export default useClipboard
