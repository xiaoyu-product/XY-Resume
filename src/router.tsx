import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { HomePage } from './pages/Home'
import { WorkbenchPage } from './pages/Workbench'

const rootRoute = createRootRoute()

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const workbenchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'workbench',
  component: WorkbenchPage,
})

const routeTree = rootRoute.addChildren([homeRoute, workbenchRoute])

const router = createRouter({ routeTree })

export { router }
export type Router = typeof router
