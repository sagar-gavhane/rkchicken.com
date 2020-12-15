import React from 'react'

export const authInitialState = {
  email: '',
  password: '',
  signedIn: false,
}

const AuthContext = React.createContext(authInitialState)

export default AuthContext
