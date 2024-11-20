export interface ICatalog {
  slug: string
  name: string
  description: string
}

export interface ICreateCatalogRequest {
  name: string
  description?: string
}

export interface IUpdateCatalogRequest {
  slug: string //Slug of the catalog
  name: string
  description?: string
}
