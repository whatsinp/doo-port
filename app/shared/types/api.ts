export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
  requestId: string
}

export interface ApiFailure {
  success: false
  message: string
  data: null
  requestId: string
  error: {
    code: string
    retryable: boolean
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
