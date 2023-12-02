import { useBoundStore } from 'store'
import useAssignCode from './hooks/useAssignCode'
import GenericButton from 'components/Button/GenericButton'

const ExchangeAssignRefCodeButton = () => {
  const { getRefCode } = useAssignCode()
  const { setModalState } = useBoundStore()

  const onGetCodeClicked = async () => {
    try {
      await getRefCode()
      setModalState({
        alert: { isOpen: true, state: 'success', message: `Succesfully register your referral code` },
      })
    } catch (e: any) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Failed to get referral code: ${e.reason}` },
      })
    }
  }

  return (
    <>
      <GenericButton name="Generate Code" onClick={onGetCodeClicked} />
    </>
  )
}

export default ExchangeAssignRefCodeButton
