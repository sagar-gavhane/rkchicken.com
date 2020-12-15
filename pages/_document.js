import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {this.props.styleTags}
          <meta name='title' content='RKChicken.com' />
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
