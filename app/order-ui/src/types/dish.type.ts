import { IBase } from './base.type'
import { ICatalog } from './catalog.type'
import { IProduct } from './product.type'

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
// "subtotal": 35000,
// "status": "pending",
// "type": "at-table",
// "tableName": "BÀN 1",
// "owner": {
//     "phonenumber": "0888888888",
//     "firstName": "Thắng",
//     "lastName": "Phan",
//     "createdAt": "Mon Nov 18 2024 14:39:21 GMT+0700 (Indochina Time)",
//     "slug": "BhRqvJswCg"
// },
// "orderItems": [
//     {
//         "quantity": 1,
//         "subtotal": 35000,
//         "note": "Nhiều nước dùng",
//         "variant": {
//             "price": 35000,
//             "createdAt": "Wed Nov 20 2024 21:26:24 GMT+0700 (Indochina Time)",
//             "slug": "vRIcfHqxa"
//         },
//         "createdAt": "Sat Nov 23 2024 22:28:47 GMT+0700 (Indochina Time)",
//         "slug": "IHqsvaApGd"
//     }
// ],
// "createdAt": "Sat Nov 23 2024 22:28:47 GMT+0700 (Indochina Time)",
// "slug": "XFPTkOc0H"
export interface ICreateOrderResponse extends IBase {
  subtotal: number
  type: string
  tableName: string
  branch: string
  owner: {
    phonenumber: string
    firstName: string
    lastName: string
    createdAt: string
    slug: string
  }
  orderItems: {
    quantity: number
    subtotal: number
    variant: {
      price: number
      createdAt: string
      slug: string
      product: IProduct
    }
    note: string
    slug: string
  }[]
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

export interface IInitateQrCodeRequest {
  paymentMethod: string
  orderSlug: string
}

export interface IInitiateQrCodeResponse {
  requestTrace: string
  qrCode: string
}
