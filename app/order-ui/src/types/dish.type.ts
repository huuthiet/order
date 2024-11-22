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
  image: string
  name: string
  quantity: number
  price: number
  description: string
  isLimit: boolean
  catalog: ICatalog
  note?: string
}
