import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { useEffect, useState } from 'react'
import useReferralCode from './hooks/useAllowedList'
import { useBoundStore } from 'store'
import { base58ToHex, hexToBase58 } from 'utils'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

const ExchangeNotAllowed = () => {
  const [inputValue, setInputValue] = useState<string>('')

  const { address } = useConnectedWallet()
  const { enterAllowedList, validateCode, isLoading, error } = useReferralCode({ address: address.full })
  const { setModalState } = useBoundStore()

  const onSubmitClicked = async () => {
    try {
      const input = validateCode(inputValue)

      if (input) {
        const hex = base58ToHex(input)
        await enterAllowedList(hex)
        setModalState({
          alert: {
            isOpen: true,
            state: 'success',
            message: `Code accepted.`,
            onOkClicked: () => {
              window.location.reload()
            },
          },
        })
      } else {
        throw Error('Invalid referal code')
      }
    } catch (e: any) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `${e}` },
      })
      console.log(e)
    }
  }

  useEffect(() => {
    if (error) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `${error}` },
      })
    }
  }, [setModalState, error])

  return (
    <>
      <div className="p-4 text-center fixed left-1/2 w-[90%] lg:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ring ring-white bg-blue-600/80 backdrop-blur text-white h-2/5">
        <div className="h-56 flex flex-col justify-center gap-2 items-center">
          <TypographyNormal>
            Exchange is still in <span className="font-semibold text-yellow-400 mt-2">Beta</span>, paste your invite to
            join
          </TypographyNormal>
          <div className="mt-2 flex flex-col items-center justify-center w-full gap-2">
            <input
              placeholder="Invite code"
              className="p-2 w-3/4 mt-2 text-slate-600 text-sm text-center"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <GenericButton name={isLoading ? 'Processing' : 'Submit'} disabled={isLoading} onClick={onSubmitClicked} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ExchangeNotAllowed
