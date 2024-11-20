import { ICatalog } from './catalog.type'

export interface IProduct {
  name: string
  description: string
  isActive: boolean
  isLimit: boolean
  image: string
  rating: number
  catalog: ICatalog
  variants: []
  slug: string
  createdAt: string
}

export interface ICreateProductRequest {
  name: string
  description?: string
  isLimit: boolean
  catalog: string
}

export interface IUpdateProductRequest {
  slug: string //Slug of the product
  name: string
  description?: string
  isLimit: boolean
  isActive?: boolean
  catalog: string
}
