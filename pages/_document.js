import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { GA_TRACKING_ID } from 'utils/gtag'

class CustomDocument extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {this.props.styleTags}
          <meta name='title' content='RKChicken.com' />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
