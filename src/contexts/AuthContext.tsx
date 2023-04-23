import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useFetch from '../hooks/useFetch'

type TAuthStatus = {
  auth: boolean
}

type AuthContextType = {
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
})

const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data,
    error,
    loading,
    renderFetch: checkAuthStatus,
  } = useFetch<TAuthStatus, {}>(
    `${process.env.REACT_APP_BACKEND_URL}/user/check-auth`,
    'GET'
  )

  const [authStatus, setAuthStatus] = useState<TAuthStatus>({
    auth: false,
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (data) {
      setAuthStatus(data)
    } else if (error) {
      setAuthStatus({ auth: false })
    }
  }, [data, error])

  const value = useMemo(
    () => ({ isLoggedIn: authStatus.auth }),
    [authStatus.auth]
  )

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
