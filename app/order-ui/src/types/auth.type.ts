export interface ILoginRequest {
  phonenumber: string
  password: string
}

export interface ILoginResponse {
  message: string
  data: {
    accessToken: string
  }
  method: string
  status: number
  timestamp: string
}
