/**
 * @file App router
 * @module app.router
 */

import {
  RouteRecordRaw,
  NavigationGuard,
  NavigationGuardNext,
  RouterHistory,
  createRouter
} from 'vue-router'

import 'vue-router'
import {LayoutColumn} from "./state";
import IndexFlowPage from '../pages/index/index.vue'

declare module 'vue-router' {
  interface RouteMeta {
    responsive?: boolean
    layout?: LayoutColumn
    validate?: (params: any) => Promise<any>
    /** seconds | infinity | false: disabled  */
    ssrCacheAge: number | false
  }
}

export enum CategorySlug {
  Code = 'code',
  Insight = 'insight'
}

export enum RouteName {
  Home = 'home',
  Article = 'article-detail',
  CategoryFlow = 'category-flow',
  TagFlow = 'tag-flow',
  DateFlow = 'date-flow',
  SearchFlow = 'search-flow',
  Archive = 'archive',
  Guestbook = 'guestbook',
  About = 'about',
  App = 'app',
  Freelancer = 'freelancer',
  Merch = 'merch',
  Lens = 'lens',
  Sponsor = 'sponsor',
  Error = 'error'
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.Home,
    components: {
      default: IndexFlowPage,
      // mobile: MobileFlow
    },
    meta: {
      responsive: true,
      ssrCacheAge: 60 * 2 // 2 mins
    }
  },
]

export interface RouterCreatorOptions {
  history: RouterHistory
  beforeMiddleware?: NavigationGuard | NavigationGuard[]
  afterMiddleware?: NavigationGuardNext | NavigationGuardNext[]
}
export const createUniversalRouter = (options: RouterCreatorOptions) => {
  const router = createRouter({
    routes,
    strict: true,
    history: options.history,
    linkActiveClass: 'link-active',
    // scrollBehavior: () => scrollToPageTop()
  })

  if (options.beforeMiddleware) {
    Array.isArray(options.beforeMiddleware)
      ? options.beforeMiddleware.forEach(router.beforeResolve)
      : router.beforeResolve(options.beforeMiddleware)
  }
  if (options.afterMiddleware) {
    Array.isArray(options.afterMiddleware)
      ? options.afterMiddleware.forEach(router.afterEach)
      : router.afterEach(options.afterMiddleware)
  }

  return router
}
