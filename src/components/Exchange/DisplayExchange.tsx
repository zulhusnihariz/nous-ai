import Avatar from 'components/Avatar'
import TypographyNormal from 'components/Typography/Normal'
import { Nft } from 'lib'
import { NousNft } from 'lib/NousNft'
import SubscribeButton from './SubscribeButton'
import UnsubscribeButton from './UnsubscribeButton'
import GoToDappButton from './GoDapp'
import { useEffect, useState } from 'react'
import SubscribePrice from './SubscribePrice'
import ExchangeTransaction from './Transactions'
import useUserKeyBalance from './hooks/useGetUserBalance'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import SubscribeFirstButton from './SubscribeFirstButton'
interface Prop {
  nft: Nft & NousNft & { dataKey: string }
}

const DisplayExchange = (prop: Prop) => {
  const { address } = useConnectedWallet()
  const { keyCount, totalTokenKeyCount } = useUserKeyBalance(prop.nft.token_id as string, address.full)
  return (
    <div className="h-full">
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 to-blue-700/60 ring-2 ring-white backdrop-blur border border-blue-600 shadow-2xl h-full">
        <div className="px-4 py-3 bg-blue-500/70 border-b border-blue-600 flex justify-between items-center">
          <TypographyNormal classNames="">{prop.nft.metadata.name}</TypographyNormal>
        </div>
        <div className="flex justify-between px-4 items-center py-2">
          <TypographyNormal classNames="text-orange-400 font-semibold text-lg tracking-wider uppercase">
            {totalTokenKeyCount} subscriber
          </TypographyNormal>
        </div>
        <hr className="h-px bg-blue-800 border-0 w-full" />
        {totalTokenKeyCount > 0 && (
          <>
            <div className="flex gap-2 p-4 items-center justify-center bg-blue-800/60">
              <div className="w-1/2">
                <SubscribeButton tokenId={prop.nft.token_id as string} userKeyCount={keyCount} />
              </div>
              <div className="w-1/2">
                <UnsubscribeButton nft={prop.nft} userKeyCount={keyCount} />
              </div>
            </div>
            <hr className="h-px bg-blue-800 border-0 w-full" />
            <div className="bg-green-800/40">
              <div className="bg-green-500/50 p-1 text-center">
                <TypographyNormal classNames="text-sm text-yellow-400">Subscriber Tiers</TypographyNormal>
              </div>
              {keyCount > 0 && (
                <div className="p-4">
                  <div className="flex gap-2 justify-start">
                    <GoToDappButton dataKey={prop.nft.dataKey} disabled={keyCount <= 0} />
                  </div>
                </div>
              )}
              {keyCount == 0 && (
                <>
                  <div className="flex gap-2 justify-center p-4">Subscribe to this AI-NFT to use AI-NFT services</div>
                </>
              )}
            </div>
            <hr className="h-px bg-blue-800 border-0 w-full" />
            <ExchangeTransaction tokenId={prop.nft.token_id as string} />
          </>
        )}
        {totalTokenKeyCount == 0 && (
          <>
            <div className="flex gap-2 p-4 items-center justify-center bg-blue-800/60 md:h-[490px]">
              <div>
                <p>
                  <TypographyNormal>Be the first to subscribe to this AI-NFT for FREE</TypographyNormal>
                </p>
                <SubscribeFirstButton tokenId={prop.nft.token_id as string} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DisplayExchange
