// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const replay = new Sentry.Replay({
  maskAllText: false,
  maskAllInputs: false,
  maskAttributes: false,
  blockAllMedia: false,
  networkDetailAllowUrls: [window.location.origin],
  networkCaptureBodies: true,
})

Sentry.init({
  dsn: 'https://f7b9ae8c13e846ab8fe4ba013392a291@o4505475304849408.ingest.sentry.io/4505475328442368',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [replay],

  ignoreErrors: [
    'ResizeObserver loop limit exceeded.',
    'ResizeObserver loop completed with undelivered notifications.',
  ],

  beforeSend: (event, hint) => {
    const error = hint.originalException

    if (error && error.message && error.message.match(/ResizeObserver/i)) {
      return null
    }

    return event
  },
})

// navigation.addEventListener('navigate', (event) => {
//   const url = new URL(event.destination.url)
//   console.log('[url]', url)

//   if (url.pathname.includes('/sales/invoice/print/')) return
//   if (url.pathname.includes('/api/s/')) return

//   replay.start()
// })
