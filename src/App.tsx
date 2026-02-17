import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/routing/PublicOnlyRoute'
import { MapSkeleton } from '@/components/ui/MapSkeleton'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const MapPage = lazy(() => import('@/pages/MapPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Suspense fallback={<MapSkeleton />}>
        <Routes>
          {/* 根路徑重定向 */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* 公開頁面 */}
          <Route path="/home" element={<HomePage />} />

          {/* 已登入才能訪問的公開頁面（登入後跳轉 /map） */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* 受保護頁面 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
