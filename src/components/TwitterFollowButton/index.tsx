import React, { useEffect } from 'react'

interface Prop {
  username: String
  onClick: () => any
}

const TwitterFollowButton = ({ username, onClick }: Prop) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <a
      href={`https://twitter.com/${username}`}
      className="twitter-follow-button"
      data-show-count="false"
      onClick={onClick}
    >
      Follow @{username}
    </a>
  )
}

export default TwitterFollowButton
