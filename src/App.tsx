import { ReactElement, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { Layout } from './components/Layout'
import { useAuth } from './contexts/AuthContext'

import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'

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

const privateRoutes = [{ path: '/dashboard', element: <Dashboard /> }]

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
          <Route index element={<Home />} />
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}

          <Route
            path="*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
