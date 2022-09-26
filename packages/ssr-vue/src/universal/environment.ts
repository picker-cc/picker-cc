/**
 * @file App environment
 * @module app.environment
 */
import {getSSRSymbleStatus} from "./context";


// app mode
export const isSSR = typeof window === 'undefined' || getSSRSymbleStatus()
export const isSPA = !isSSR

// runtime env
// @ts-ignore
export const isServer = import.meta.env.SSR
export const isClient = !isServer
