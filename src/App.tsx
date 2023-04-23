import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={false} />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
