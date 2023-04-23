import { ReactElement, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { Layout } from './components/Layout'
import { useAuth } from './contexts/AuthContext'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { MyAccount } from './pages/MyAccount'
import { Signup } from './pages/Signup'

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])

  return children
}

function PublicRoute({ children }: { children: ReactElement }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard')
    }
  }, [isLoggedIn])

  return children
}

const privateRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/my-account', element: <MyAccount /> },
]

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/signup', element: <Signup /> },
  { path: '*', element: <Home /> },
]

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}
          {publicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PublicRoute>{element}</PublicRoute>}
            />
          ))}
        </Route>
      </Routes>
    </div>
  )
}

export default App
