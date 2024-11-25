import { IBase } from './base.type'
import { IProduct } from './product.type'

export interface IMenu extends IBase {
  date: string
  branchSlug: string
  menuItems: IMenuItem[]
}

export interface ICreateMenuRequest {
  date: string
  branchSlug: string
}

export interface ISpecificMenuRequest {
  slug?: string // This is the slug of the menu
  date?: string
  branch?: string
}

export interface IUpdateMenuRequest {
  slug: string // This is the slug of the menu
  date: string
  branchSlug: string
}

export interface ISpecificMenu extends IBase {
  date: string
  menuItems: IMenuItem[]
}

export interface IMenuItem extends IBase {
  currentStock: number
  defaultStock: number
  product: IProduct
}

export interface ICreateMenuRequest {
  date: string
  branchSlug: string
}

export interface IUpdateMenuRequest {
  slug: string // This is the slug of the menu
  date: string
  branchSlug: string
}

export interface IAddMenuItemRequest {
  menuSlug: string
  productSlug: string
  defaultStock: number
}

export interface IMenuItemStore {
  menuItems: string[] // Danh sách productSlug
  getMenuItems: () => string[] // Lấy danh sách productSlug
  addMenuItem: (item: string) => void // Thêm productSlug vào danh sách
  removeMenuItem: (menuItemId: string) => void // Xoá productSlug khỏi danh sách
  clearMenuItems: () => void // Xoá toàn bộ danh sách productSlug
}
