export interface IUserInfo {
  slug: string
  avatar?: string
  phonenumber: string
  firstName: string
  lastName: string
  dob: string
  email: string
  address: string
  branch: {
    name: string
    address: string
  }
}

export interface IUpdateProfileRequest {
  firstName: string
  lastName: string
  dob: string
  address: string
  branch: string
}
