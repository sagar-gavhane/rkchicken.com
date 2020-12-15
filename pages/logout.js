import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import AuthContext, { authInitialState } from 'context/AuthContext'

const LogoutPage = () => {
  const [, setUser] = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    setUser(authInitialState)
    router.push('/')
  }, [])

  return null
}

export default LogoutPage
