import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { MapSkeleton } from '@/components/ui/MapSkeleton'

export function ProtectedRoute() {
    const { currentUser, isInitialized } = useAuthStore()
    const location = useLocation()

    if (!isInitialized) {
        return <MapSkeleton />
    }

    if (!currentUser) {
        return (
            <Navigate
                to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`}
                replace
            />
        )
    }

    return <Outlet />
}
