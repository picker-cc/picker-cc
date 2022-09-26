
/**
 * BFF顾名思义就是Backend For Frontend，用中文解释就是服务于前端的后端
 * @file BFF server entry
 * @module BFF-server
 */

import express from 'express'
import { createExpressApp } from './server'
import {PUBLIC_PATH} from "./server/helpers/configurer";
// import {cacher} from "./server/helpers/cacher";
// import {erroror, responsor} from "./server/helpers/responsor";
import {enableDevRenderer} from "./server/renderer/dev";
import {enableProdRenderer} from "./server/renderer/prod";
import {isDev, NODE_ENV} from "./environment";
import {getBFFServerPort} from "./config/bff.config";

// @ts-expect-error
process.noDeprecation = true

// app
createExpressApp().then(({ app, server, cache }) => {
  // static
  app.use(express.static(PUBLIC_PATH))
  // init thirds task

  // // sitemap
  // app.get('/sitemap.xml', async (_, response) => {
  //   try {
  //     const data = await cacher({
  //       cache,
  //       key: 'sitemap',
  //       age: 60 * 60 * 1, // 1 hours
  //       getter: async () => null
  //     })
  //     response.header('Content-Type', 'application/xml')
  //     response.send(data)
  //   } catch (error) {
  //     erroror(response, error)
  //   }
  // })
  //
  // // RSS
  // app.get('/rss.xml', async (_, response) => {
  //   try {
  //     const data = await cacher({
  //       cache,
  //       key: 'rss',
  //       age: 60 * 60 * 1, // 1 hours
  //       getter: async () => null
  //     })
  //     response.header('Content-Type', 'application/xml')
  //     response.send(data)
  //   } catch (error) {
  //     erroror(response, error)
  //   }
  // })


  // vue renderer
  isDev ? enableDevRenderer(app, cache) : enableProdRenderer(app, cache)

  // run
  server.listen(getBFFServerPort(), () => {
    const infos = [
      `in ${NODE_ENV}`,
      `at ${new Date().toLocaleString()}`,
      `listening on ${JSON.stringify(server.address())}`
    ]
    console.info('[picker.cc]', `Run! ${infos.join(', ')}.`)
  })
})
