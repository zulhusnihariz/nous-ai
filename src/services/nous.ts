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
