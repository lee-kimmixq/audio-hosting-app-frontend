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

const privateRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/my-account', element: <MyAccount /> },
]

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
          <Route index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
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
