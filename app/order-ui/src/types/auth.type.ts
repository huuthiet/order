export interface ILoginRequest {
  phonenumber: string
  password: string
}

export interface ILoginResponse {
  message: string
  result: {
    accessToken: string
  }
  method: string
  status: number
  timestamp: string
}

export interface IRegisterRequest {
  phonenumber: string
  password: string
  firstName: string
  lastName: string
}
