/**
 * @file App main logic
 * @module app.main
 */

import { CreateAppFunction, computed } from 'vue'
import { RouterHistory } from 'vue-router'
import { rebirthSSRContext } from '../universal'
// import { createUniversalStore } from '/@/stores'
// import { createI18n } from '/@/composables/i18n'
// import { createMeta } from '/@/composables/meta'
// import { createTheme, Theme } from '/@/composables/theme'
import { NODE_ENV } from '../environment'
import { isSSR } from './environment'
import { createUniversalRouter, RouterCreatorOptions } from './router'
import { createGlobalState, LayoutColumn } from './state'
// import component from './component'
import App from './index.vue'

console.info(`[APP INITED]:`, { NODE_ENV, mode: isSSR ? 'SSR' : 'SPA' }, )

export interface ICreatorContext {
  appCreator: CreateAppFunction<Element>
  historyCreator(base?: string): RouterHistory
  routerBeforeMiddleware?(globalState: any): RouterCreatorOptions['beforeMiddleware']
  routerAfterMiddleware?(globalState: any): RouterCreatorOptions['afterMiddleware']
  layout?: LayoutColumn
  theme: any
  language: string
  userAgent: string
}

export type VueApp = ReturnType<typeof createVueApp>
export const createVueApp = (context: ICreatorContext) => {
  // 1. create app
  const app = context.appCreator(App)
  // 2. ssr context
  const ssrContext = rebirthSSRContext(app)
  // 3. global state
  const globalState = createGlobalState({
    userAgent: context.userAgent || '',
    language: context.language || '',
    layout: context.layout ?? LayoutColumn.Normal
  })
  // 4. store
  // const store = createUniversalStore({ globalState })
  // 5. router
  const router = createUniversalRouter({
    beforeMiddleware: context.routerBeforeMiddleware?.(globalState),
    afterMiddleware: context.routerAfterMiddleware?.(globalState),
    history: context.historyCreator()
  })
  // 6. composables
  // const meta = createMeta({
  //   titler: (title: string) => `${title} | ${META.title}`
  // })
  // const theme = createTheme(context.theme)
  // const i18n = createI18n({
  //   default: globalState.userAgent.isZhUser ? Language.Chinese : Language.English,
  //   keys: Object.values(LanguageKey),
  //   languages
  // })

  // root attrbute
  // meta.addHeadObjs(
  //   computed(() => ({
  //     htmlAttrs: {
  //       'data-theme': theme.theme.value,
  //       'data-device': globalState.userAgent.isMobile ? 'mobile' : 'desktop'
  //     }
  //   }))
  // )
  //
  // handle global error
  app.config.errorHandler = (error) => globalState.setRenderError(error)
  // handle router error https://next.router.vuejs.org/api/#onerror
  router.onError(globalState.setRenderError)

  // handle router validate error & 404 error
  // https://next.router.vuejs.org/guide/advanced/navigation-guards.html#optional-third-argument-next
  router.beforeEach((to, _, next) => {
    if (to.meta.validate) {
      ;(to.meta as any)
        // .validate({ route: to, i18n, store })
        .then(next)
        .catch((error) => {
          const newError: any = new Error()
          newError.code = error.code
          newError.message = error.message
          // next(error) > router error > global state error
          next(newError)
        })
    } else {
      next()
    }
  })

  app.use(router)
  // app.use(store)
  app.use(globalState)
  // app.use(i18n)
  // app.use(meta)
  // app.use(theme)
  // app.use(component)

  return {
    app,
    router,
    // store,
    globalState,
    // i18n,
    // meta,
    // theme,
    // component
  }
}
