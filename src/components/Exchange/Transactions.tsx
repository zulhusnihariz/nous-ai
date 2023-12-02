import TypographyNormal from 'components/Typography/Normal'
import { usePatreonTransactionByTokenId } from 'repositories/patreon.repository'
import { displayShortAddress } from 'utils'

interface Prop {
  tokenId: string
}

const ExchangeTransaction = (prop: Prop) => {
  const { data } = usePatreonTransactionByTokenId(prop.tokenId)
  return (
    <div className="flex flex-col gap-1 px-4 py-2">
      {data &&
        data.map(transaction => (
          <div className="text-sm uppercase tracking-wider">
            <TypographyNormal>
              <span className="">{displayShortAddress(transaction.address as string)}</span>{' '}
              <span className={`${transaction.activity === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.activity === 'buy' ? 'subscribed' : 'unsubscribed'}
              </span>{' '}
              <span className="">{transaction.amount} access</span>
            </TypographyNormal>
          </div>
        ))}
    </div>
  )
}

export default ExchangeTransaction
