import axios from 'axios'
const originalUrl = 'http://localhost:3003/api/login'

// Route käyttäjän sisäänkirjaamiseen.
const login = async credentials => {
  const response = await axios.post(originalUrl, credentials)
  return response.data
}

export default { login }
