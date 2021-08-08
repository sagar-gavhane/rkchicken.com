import { QueryClient } from 'react-query'

const queryCache = new QueryClient({
  defaultConfig: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
})

export default queryCache
