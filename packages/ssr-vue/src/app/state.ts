/**
 * @file App local global state
 * @module app.state
 */

import {App, inject, ref, computed, reactive, readonly} from 'vue'
import {INVALID_ERROR} from '../constants/error'
import {universalRef, onClient} from '../universal'

type RenderErrorValue = RenderError | null

export interface RenderError {
    code: number
    message: string
}

export enum ImageExt {
    WebP = 'webp',
    Jpg = 'jpeg'
}

export enum LayoutColumn {
    Normal = 0,
    Wide = 1, // 3 column
    Full = 2 // full page
}

export interface GlobalRawState {
    renderError: RenderErrorValue
    userAgent: string
    language: string
    layout: LayoutColumn
}

export interface GlobalStateConfig {
    userAgent: string
    language: string
    layout: LayoutColumn
}

const GlobalStateSymbol = Symbol('globalState')
export type GlobalState = ReturnType<typeof createGlobalState>
export const createGlobalState = (config: GlobalStateConfig) => {
    // Render error
    const renderError = universalRef<RenderErrorValue>('error', () => null)
    const defaultError = {code: INVALID_ERROR}
    const setRenderError = (error: any) => {
        onClient(() => {
            console.warn('App error:', error)
        })
        if (!error) {
            // clear error
            renderError.value = null
        } else if (error instanceof Error) {
            // new Error
            renderError.value = {
                code: (error as any).code ?? defaultError.code,
                message: error.message
            }
        } else if (typeof error === 'string') {
            // error message
            renderError.value = {
                ...defaultError,
                message: error
            }
        } else {
            // error object -> axios | component
            renderError.value = {
                ...error,
                code: error.status || error.status || defaultError.code
            }
        }
    }

    // Hydrated
    const isHydrated = ref(false)
    const setHydrate = () => {
        isHydrated.value = true
    }

    // UI layout
    const layoutValue = ref(config.layout)
    const layoutColumn = computed(() => ({
        layout: layoutValue.value,
        isNormal: layoutValue.value === LayoutColumn.Normal,
        isWide: layoutValue.value === LayoutColumn.Wide,
        isFull: layoutValue.value === LayoutColumn.Full
    }))
    const setLayoutColumn = (layout: LayoutColumn) => {
        if (layout !== layoutValue.value) {
            layoutValue.value = layout
        }
    }

    // Global switchers
    const switcher = reactive({
        sponsor: false,
        feedback: false,
        statement: false
    })
    const toggleSwitcher = (key: keyof typeof switcher, value: boolean) => {
        switcher[key] = value
    }

    // export state
    const toRawState = (): GlobalRawState => ({
        renderError: renderError.value,
        // userAgent: userAgent.original,
        // language: userAgent.language,
        userAgent: "",
        language: "",
        layout: layoutValue.value
    })

    const globalState = {
        toRawState,
        // Render error state
        renderError: readonly(renderError),
        setRenderError,
        // Hydrate state
        isHydrated: readonly(isHydrated),
        setHydrate,
        // Layout state
        layoutColumn,
        setLayoutColumn,
        // Device state
        // userAgent: readonly(userAgent),
        userAgent: "",
        imageExt: "",
        // Global switchers
        switcher: readonly(switcher),
        toggleSwitcher
    }

    return {
        ...globalState,
        install(app: App) {
            app.provide(GlobalStateSymbol, globalState)
        }
    }
}

export const useGlobalState = (): GlobalState => {
    return inject(GlobalStateSymbol) as GlobalState
}
