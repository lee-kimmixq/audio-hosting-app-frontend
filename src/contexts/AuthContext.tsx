import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { REACT_APP_BACKEND_URL } from '../config'
import useFetch from '../hooks/useFetch'

type TAuthStatus = {
  auth: boolean | null
}

type AuthContextType = {
  isLoggedIn: boolean | null
  setAuth: (status: boolean | null) => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setAuth: () => {},
})

const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<TAuthStatus>({ auth: null })
  const [loading, setLoading] = useState<boolean>(true)

  const {
    data,
    error,
    renderFetch: checkAuthStatus,
  } = useFetch<TAuthStatus, {}>(
    `${REACT_APP_BACKEND_URL}/user/check-auth`,
    'GET'
  )

  useEffect(() => {
    checkAuthStatus()
    setLoading(true)
  }, [])

  useEffect(() => {
    if (data) {
      setLoading(false)
      setAuthStatus(data)
    } else if (error) {
      setLoading(false)
      setAuthStatus({ auth: false })
    }
  }, [data, error])

  const setAuth = useCallback((status: boolean | null) => {
    setAuthStatus({ auth: status })
  }, [])

  const value = useMemo(
    () => ({ setAuth, isLoggedIn: authStatus.auth }),
    [authStatus.auth]
  )

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
