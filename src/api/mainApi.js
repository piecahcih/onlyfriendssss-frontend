import axios from 'axios'

const mainApi = axios.create({
  baseURL: 'http://localhost:3999/api'
})

export default mainApi