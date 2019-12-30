import React from 'react'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { getMarkupFromTree } from 'react-apollo'
import proxy from 'http-proxy-middleware'

import App from './App'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST) // eslint-disable-line @typescript-eslint/no-var-requires

console.log('RAZZLE_PUBLIC_DIR', process.env.RAZZLE_PUBLIC_DIR)
const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR || 'static'))
  .use(
    '/graphql',
    proxy({ target: process.env.BACKEND_URL || 'http://localhost:4000' })
  )
  .get('/*', async (req, res) => {
    const context = {}
    const markup = await getMarkupFromTree({
      renderFunction: renderToString,
      tree: (
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      ),
    })

    if (context.url) {
      res.redirect(context.url)
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      )
    }
  })

export default server
