import Avatar from 'components/Avatar'
import TypographyNormal from 'components/Typography/Normal'
import { Nft, NftMetadata } from 'lib'
import { NousNft } from 'lib/NousNft'

interface Prop {
  dataKey: string
  nft: Nft & NousNft
}

const BotCard = ({ nft }: Prop) => {
  return (
    <div>
      <div className="group relative block overflow-hidden ring-2 ring-white bg-black/50">
        <div>
          <h3 className="absolute end-4 bottom-2 md:bottom-4 z-10 text-md font-medium truncate text-white">
            <TypographyNormal>{nft.metadata.name}</TypographyNormal>
          </h3>

          <Avatar imgMain={nft.metadata.image} imgBadge={nft.achievement?.badge} badgeSize="5" />
        </div>
      </div>
    </div>
  )
}

export default BotCard
