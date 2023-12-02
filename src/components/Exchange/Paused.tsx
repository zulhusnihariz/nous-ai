import TypographyNormal from 'components/Typography/Normal'

const ExchangePaused = () => {
  return (
    <>
      <div className="p-4 text-center fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ring ring-white bg-blue-600/90 backdrop-blur text-white h-2/5 w-1/2">
        <div className="h-56 flex flex-col justify-center gap-2 items-center text-xl">
          <TypographyNormal>
            NFT Patreon V1 contract is <span className="font-semibold text-yellow-400 mt-2 uppercase">Paused</span> for
            maintenance.
          </TypographyNormal>
          <div>
            <TypographyNormal>Please come back later.</TypographyNormal>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExchangePaused
