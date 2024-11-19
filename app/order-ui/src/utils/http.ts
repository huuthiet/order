import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  // AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import NProgress from 'nprogress'
// import moment from 'moment'

import { useRequestStore } from '@/stores'
import { useAuthStore } from '@/stores'
// import { IApiResponse } from '@/types'
// import { showErrorToast } from './toast'
import { baseURL } from '@/constants'
import { useLoadingStore } from '@/stores'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

// let isRefreshing = false
// let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = []

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (token) {
//       prom.resolve(token)
//     } else {
//       prom.reject(error)
//     }
//   })
//   failedQueue = []
// }

// const isTokenExpired = (expiryTime: string): boolean => {
//   const currentDate = moment()
//   const expireDate = moment(expiryTime)
//   return currentDate.isAfter(expireDate)
// }

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authState = useAuthStore.getState()
    const { isAuthenticated } = authState

    // console.log('Request interceptor - Initial token check:', token, isAuthenticated())

    // Allow requests to public routes (login, register, etc.)
    const publicRoutes = ['/auth/login', '/auth/register', '/products', '/logger']
    if (publicRoutes.includes(config.url || '')) {
      return config
    }

    // Prevent requests if not authenticated
    if (!isAuthenticated()) {
      return Promise.reject(new Error('User is not authenticated'))
    }

    // Get fresh token state
    const currentToken = useAuthStore.getState().token
    // console.log('Request interceptor - Current token before setting header:', currentToken)

    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`
      // console.log('Token set in headers:', currentToken)

      if (!config?.doNotShowLoading) {
        const requestStore = useRequestStore.getState()
        if (requestStore.requestQueueSize === 0) {
          NProgress.start()
        }
        requestStore.incrementRequestQueueSize()
      }
    } else {
      console.log('No token available when trying to set headers')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    if (!response.config?.doNotShowLoading) setProgressBarDone()
    return response
  },
  async (error) => {
    if (!error.config?.doNotShowLoading) setProgressBarDone()
    if (error.response) {
      // if (status === 401) {
      //   showErrorToast(code)
      // }
      // if (status === 403) {
      //   showErrorToast(code)
      //   window.location.href = '/auth/login'
      // }
      // if (status === 404) {
      //   showErrorToast(code)
      // }
      // if (status === 500) {
      //   showErrorToast(code)
      // }
    }
    return Promise.reject(error)
  }
)

async function setProgressBarDone() {
  useRequestStore.setState({ requestQueueSize: useRequestStore.getState().requestQueueSize - 1 })
  if (useRequestStore.getState().requestQueueSize > 0) {
    NProgress.inc()
  } else {
    NProgress.done()
  }
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  doNotShowLoading?: boolean
}

axiosInstance.interceptors.request.use(
  (config) => {
    if (!(config as CustomAxiosRequestConfig).doNotShowLoading) {
      useLoadingStore.getState().setIsLoading(true)
    }
    return config
  },
  (error) => {
    useLoadingStore.getState().setIsLoading(false)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setIsLoading(false)
    return response
  },
  (error) => {
    useLoadingStore.getState().setIsLoading(false)
    return Promise.reject(error)
  }
)

export default axiosInstance
