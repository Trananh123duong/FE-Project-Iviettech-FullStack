import axios from 'axios'

export const END_POINT = import.meta.env.VITE_END_POINT
export const BASE_URL = `${END_POINT}/api`

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const result = await axios.post(`${BASE_URL}/auth/refresh`, {
          token: refreshToken,
        })
        const { accessToken } = result.data
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login' // Redirect to login page
        return Promise.reject(err)
      }
    }
    return Promise.reject(error.response.data)
  }
)

export default api