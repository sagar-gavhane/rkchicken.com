// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

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
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

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
