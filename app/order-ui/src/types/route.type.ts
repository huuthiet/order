import { Role } from '@/constants'
import React from 'react'
// import { IPermission } from './permission.type'

export interface ISidebarRoute {
  title: string
  path: string
  icon?: React.ComponentType
  isActive?: boolean
  roles?: Role[] // Changed from 'role' to 'roles' to support multiple roles
  children?: ISidebarRoute[]
}
