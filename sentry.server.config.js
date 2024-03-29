// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://f7b9ae8c13e846ab8fe4ba013392a291@o4505475304849408.ingest.sentry.io/4505475328442368',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  integrations: [
    new Sentry.Integrations.Mongo({
      useMongoose: true,
    }),
  ],
})
