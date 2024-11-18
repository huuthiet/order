'use client'

import { ChevronRight, Command, Sparkles } from 'lucide-react'
import { useLocation, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  IconWrapper,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem
} from '@/components/ui'
import { sidebarRoutes } from '@/router/routes'
import { ISidebarRoute } from '@/types'

export default function AppSidebar() {
  const { t } = useTranslation('sidebar')
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const translatedSidebarRoute = (sidebarRoutes: ISidebarRoute) => ({
    ...sidebarRoutes,
    title: t(`${sidebarRoutes.title}`),
    children: sidebarRoutes.children?.map((child) => ({
      ...child,
      title: t(`${child.title}`)
    }))
  })

  // Translate all sidebar routes
  const translatedRoutes = sidebarRoutes.map(translatedSidebarRoute)

  return (
    <Sidebar variant="inset" className="z-50 bg-white border-r" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/staff/home" className="flex items-center w-full gap-3">
                <div className="flex items-center justify-center text-white rounded-lg aspect-square size-8 bg-primary shrink-0 group-data-[collapsible=icon]:w-full">
                  <Command className="size-4" />
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-primary">SMART</span>
                  <span>COFFEE</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {translatedRoutes.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={isActive(item.path) ? 'text-primary' : ''}
                  >
                    <NavLink to={item.path}>
                      {item.icon && (
                        <IconWrapper
                          Icon={item.icon}
                          className={isActive(item.path) ? 'text-primary' : ''}
                        />
                      )}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.children?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={isActive(subItem.path) ? 'text-primary' : ''}
                              >
                                <NavLink to={subItem.path} className="flex flex-col gap-4">
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild></DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
