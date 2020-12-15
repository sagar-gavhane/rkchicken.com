import React, { Fragment, useEffect } from 'react'
import Head from 'next/head'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { useRouter } from 'next/router'
import * as gtag from 'utils/gtag'
import 'antd/dist/antd.css'
import 'nprogress/nprogress.css'
import 'styles/global.css'

import AuthContext, { authInitialState } from 'context/AuthContext'
import useLocalStorage from 'hooks/useLocalStorage'

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
})

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
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ReactQueryDevtools />
          <Component {...pageProps} />
        </ReactQueryCacheProvider>
      </AuthContext.Provider>
    </Fragment>
  )
}

export default MyApp
