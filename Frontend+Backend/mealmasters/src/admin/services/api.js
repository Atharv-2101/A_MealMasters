import axios from "axios"
import { config } from "../../services/config"

const api = axios.create({
  baseURL: config.url,
})

// TEMP ADMIN TOKEN (DEV MODE)
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjcsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTk2NzAxNH0.qBRNYi1r5wSSFzf7pOVOQd_7ctsOoNQB47O9bOcYuEU"

// attach token automatically
api.interceptors.request.use((request) => {
  request.headers.token = ADMIN_TOKEN   // ✅ IMPORTANT FIX
  return request
})

export default api
