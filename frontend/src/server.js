import App from './App'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { getMarkupFromTree } from 'react-apollo-hooks'
import { ServerStyleSheet } from 'styled-components'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST) // eslint-disable-line @typescript-eslint/no-var-requires

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    // Create the server side style sheet
    const sheet = new ServerStyleSheet()

    const context = {}
    const markup = await getMarkupFromTree({
      renderFunction: renderToString,
      tree: sheet.collectStyles(
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      ),
    })
    // Generate all the style tags so they can be rendered into the page
    const styleTags = sheet.getStyleTags()

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
        <!-- Render the style tags gathered from the components into the DOM -->
        ${styleTags}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      )
    }
  })

export default server
