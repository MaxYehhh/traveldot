import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { SignupForm } from '@/components/auth/SignupForm'
import logoAuth from '@/assets/logo_auth.png'

export default function RegisterPage() {
    const { currentUser } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    // 註冊成功後跳轉 returnUrl，無則跳轉 /map
    useEffect(() => {
        if (currentUser) {
            const params = new URLSearchParams(location.search)
            const returnUrl = params.get('returnUrl')
            navigate(returnUrl || '/map', { replace: true })
        }
    }, [currentUser, navigate, location.search])

    // onToggleMode 換為導航到 /login
    const handleToggleMode = () => {
        navigate('/login')
    }

    return (
        <div className="h-screen w-screen overflow-hidden relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/auth-bg.png)' }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content: single-column centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0">
                {/* Logo */}
                <div className="flex flex-col items-center -mb-32">
                    <Link to="/home">
                        <img
                            src={logoAuth}
                            alt="TravelDot"
                            className="w-[400px] object-contain drop-shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Form */}
                <div className="w-full max-w-[420px] px-6">
                    <SignupForm onToggleMode={handleToggleMode} />
                </div>
            </div>
        </div>
    )
}
