import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { MapSkeleton } from '@/components/ui/MapSkeleton'

export function PublicOnlyRoute() {
    const { currentUser, isInitialized } = useAuthStore()

    if (!isInitialized) {
        return <MapSkeleton />
    }

    if (currentUser) {
        return <Navigate to="/map" replace />
    }

    return <Outlet />
}
