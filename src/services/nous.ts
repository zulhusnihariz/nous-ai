import axios from 'axios'

export const chatWithNous = (id: string, sender: string, message: string) => {
  return axios({
    url: `https://${id}.nous.mesolitica.com/webhooks/rest/webhook`,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    data: {
      sender,
      message,
    },
  })
}

export const updateChatBot = (id: string, name: string, url: string) => {
  return axios({
    url: `https://app.nous.mesolitica.com/nous_psyche/update_chatbot?email=${import.meta.env.VITE_MESOLITICA_EMAIL}`,
    headers: {
      'Data-Api-Key': import.meta.env.VITE_MESOLITICA_DATA_API_KEY,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    data: {
      id,
      chatbot_name: name,
      chatbot_url: url,
    },
  })
}
