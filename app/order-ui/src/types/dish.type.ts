import { ICatalog } from './catalog.type'

export interface IDish {
  id: number
  image: string
  name: string
  price: number
  description: string
  type: string
  main_ingredients: string[]
  availability: boolean
  preparation_time: number
  discount: number
  calories: number
}

export interface ICartItem {
  id: string
  slug: string
  owner?: string
  ownerPhoneNumber?: string
  type: string
  branch?: string
  orderItems: IOrderItem[]
  table?: string
  note?: string
}

export interface IOrderItem {
  id: string
  slug: string
  image: string
  name: string
  quantity: number
  variant: string
  price: number
  description: string
  isLimit: boolean
  catalog: ICatalog
  note?: string
}

export interface IOrder {
  type: string
  table: string
  branch: string
  owner: string
  orderItems: {
    quantity: number
    variant: string
    note: string
  }
}

export interface ICreateOrderRequest {
  type: string
  table: string
  branch: string
  owner: string
  orderItems: {
    quantity: number
    variant: string
    note: string
  }[]
}
