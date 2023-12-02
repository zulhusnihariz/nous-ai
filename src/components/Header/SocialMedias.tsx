import { DiscordMediaIcon, XMediaIcon } from "components/Icons/icons"


const SocialMedias = () => {
  return (
    <div className="flex w-full justify-center gap-6 sm:gap-0">
      <a href="https://twitter.com/thenouspsyche" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600/80 sm:bg-transparent sm:rounded-none sm:py-5 sm:px-4 p-2 rounded-full sm:hover:border">
        <XMediaIcon />
      </a>

      <a href="https://discord.com/invite/96xkTdHF6p" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600/80 sm:bg-transparent sm:rounded-none sm:py-5 sm:px-4 p-2 rounded-full sm:hover:border" >
        <DiscordMediaIcon />
      </a>
    </div>
  )
}

export default SocialMedias