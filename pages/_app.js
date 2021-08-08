import React, { Fragment, useEffect } from 'react'
import Head from 'next/head'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useRouter } from 'next/router'
import * as gtag from 'utils/gtag'
import 'antd/dist/antd.css'
import 'nprogress/nprogress.css'
import 'styles/global.css'

import AuthContext, { authInitialState } from 'context/AuthContext'
import useLocalStorage from 'hooks/useLocalStorage'
import queryCache from 'utils/queryCache'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [user, setUser] = useLocalStorage('auth', authInitialState)

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <Fragment>
      <Head>
        <title>RKChicken</title>
      </Head>
      <AuthContext.Provider value={[user, setUser]}>
        <QueryClientProvider client={queryCache}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </AuthContext.Provider>
    </Fragment>
  )
}

export default MyApp
