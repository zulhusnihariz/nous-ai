import GenericButton from 'components/Button/GenericButton'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { Custom, Nft } from 'lib'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RQ_KEY } from 'repositories'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { useQueryClient } from 'wagmi'

const BuilderConfiguration = (prop: { nft: Nft }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState<Custom>(
    prop.nft?.custom ?? {
      name: '',
      description: '',
      instructions: '',
      conversationStarters: [''],
    }
  )

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleConversationStarterChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setInput(prev => ({
      ...prev,
      conversationStarters: prev.conversationStarters.map((el, index) => {
        if (index === idx) {
          return e.target.value
        } else {
          return el
        }
      }),
    }))
  }

  useEffect(() => {
    const lastIndex = input.conversationStarters.length - 1

    if (input.conversationStarters[lastIndex].length > 0) {
      setInput(prev => ({
        ...prev,
        conversationStarters: [...prev.conversationStarters, ''],
      }))
    }
  }, [input.conversationStarters])

  const removeConversationStarter = (idx: number) => {
    if (input.conversationStarters.length === 1) return

    setInput(prev => ({
      ...prev,
      conversationStarters: prev.conversationStarters.filter((_, index) => index !== idx),
    }))
  }

  const { mutateAsync: publish } = usePublishTransaction()
  const { address, signMessage } = useConnectedWallet()
  const queryClient = useQueryClient()

  const onSubmitClicked = async () => {
    const content = JSON.stringify(input)
    setIsLoading(true)

    const signature = (await signMessage(JSON.stringify(content))) as string

    await publish({
      alias: 'custom',
      chain_id: prop.nft.chain_id as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full.toLowerCase(),
      signature,
      token_address: prop.nft.token_address as string,
      token_id: prop.nft.token_id as string,
      version: '',
    })

    const timeout: NodeJS.Timeout = setTimeout(async () => {
      await queryClient.invalidateQueries([[RQ_KEY.GET_LINEAGE_NOUS_METADATA, prop.nft.dataKey, 'custom']])
      if (timeout) clearTimeout(timeout)
    }, 5000)

    setIsLoading(false)
  }

  useEffect(() => {
    if (!prop.nft) navigate('/inventory')
  }, [prop.nft])

  return (
    <div className="m-4 p-4 text-center transform ring ring-white bg-blue-600/80 backdrop-blur text-white h-full lg:h-[600px] w-2/4">
      <h1 className="font-extrabold text-xl">CONFIGURE</h1>
      <div className="flex flex-col items-start w-full overflow-y-auto no-scrollbar h-[450px]">
        <label htmlFor="name">Name</label>
        <input
          className="p-2 w-full text-slate-600 text-sm mb-2"
          name="name"
          value={input.name}
          onChange={handleInputChange}
        />

        <label htmlFor="description">Description</label>
        <input
          className="p-2 w-full mb-2  text-slate-600 text-sm"
          name="description"
          value={input.description}
          onChange={handleInputChange}
        />

        <label htmlFor="instructions">Instructions</label>
        <textarea
          className="p-2 w-full mb-2 min-h-[100px] max-h-[200px] text-slate-600 text-sm"
          name="instructions"
          value={input.instructions}
          onChange={handleInputChange}
        />

        <label>Conversation Starters</label>

        {input.conversationStarters.map((el: string, idx: number) => {
          return (
            <div className="flex w-full items-center">
              <input
                className="p-2 w-full mt-2 text-slate-600 text-sm"
                name="description"
                value={input.conversationStarters[idx]}
                onChange={e => handleConversationStarterChange(e, idx)}
              />

              {input.conversationStarters.length > 1 && (
                <button onClick={() => removeConversationStarter(idx)} className="ml-2">
                  X
                </button>
              )}
            </div>
          )
        })}
      </div>
      <GenericButton
        name={isLoading ? 'Processing' : 'Save'}
        disabled={isLoading}
        onClick={onSubmitClicked}
        className="mt-8"
      />
    </div>
  )
}
export default BuilderConfiguration
