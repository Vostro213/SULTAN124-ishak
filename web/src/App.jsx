import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import SpeedCalculator from './pages/SpeedCalculator'
import ResourcesCalculator from './pages/ResourcesCalculator'
import TrainingCalculator from './pages/TrainingCalculator'
import Premium from './pages/Premium'
import SyncGuide from './pages/SyncGuide'
import About from './pages/About'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="account" element={<Account />} />
        <Route path="speed" element={<SpeedCalculator />} />
        <Route path="resources" element={<ResourcesCalculator />} />
        <Route path="training" element={<TrainingCalculator />} />
        <Route path="premium" element={<Premium />} />
        <Route path="sync" element={<SyncGuide />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
