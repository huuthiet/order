import { IBase } from './base.type'
import { IBranch } from './branch.type'
import { ITrackingOrderItems } from './dish.type'
import { IProduct, IProductVariant } from './product.type'
import { IPromotion } from './promotion.type'

export enum ChefOrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum ChefOrderItemStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
}

export interface IChefArea extends IBase {
  name: string
  description: string
  branch: IBranch
  productChefAreas: IChefAreaProduct[]
}

export interface ICreateChefAreaRequest {
  branch: string
  name: string
  description?: string
}

export interface IUpdateChefAreaRequest {
  slug: string
  branch: string
  name: string
  description?: string
}

export interface IChefAreaProduct extends IBase {
  chefArea: IChefArea
  products: IProduct[]
}

export interface ICreateChefAreaProductRequest {
  chefArea: string
  products: string[]
}

export interface IUpdateChefAreaProductRequest {
  chefAreaProduct: string // This should be chefAreaProduct slug
  chefArea: string
  product: string
}

export interface IGetChefOrderRequest {
  chefArea?: string
  status?: string
}

export interface IChefSpecificOrder extends IBase {
  chefOrderItems: ISpecificChefOrderItem[]
  status: ChefOrderStatus
}

export interface ISpecificChefOrderItems extends IBase {
  quantity: number
  subtotal: number
  note: string
  variant: IProductVariant
  status: ChefOrderItemStatus
}

export interface ISpecificChefOrderItem extends IBase {
  chefOrder: {
    createdAt: string
    slug: string
  }
  defaultQuantity: number
  orderItem: ISpecificChefOrderItems
  status: ChefOrderItemStatus
}

export interface IChefOrderItems extends IBase {
  index?: number
  id: string
  quantity: number
  subtotal: number
  note: string
  variant: IProductVariant
  trackingOrderItems: ITrackingOrderItems[]
  promotion?: IPromotion
  chefOrderItems?: IChefOrderItemStatus[]
  status: {
    PENDING: number
    COMPLETED: number
    FAILED: number
    RUNNING: number
  }
}

export interface IChefOrderItemStatus extends IBase {
  status: ChefOrderItemStatus
  defaultQuantity: number
}

export interface IChefOrderInfo extends IBase {
  subtotal: number
  status: string
  type: string
}

export interface IChefOrders extends IBase {
  status: ChefOrderStatus
  order: IChefOrderInfo
  chefOrderItems: IChefOrderItems[]
}

export interface IUpdateChefOrderStatusRequest {
  slug: string
  status: string
}

export interface IUpdateChefOrderItemStatusRequest {
  slug: string
  status: string
}
