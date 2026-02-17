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
                    <img
                        src={logoAuth}
                        alt="TravelDot"
                        className="w-[400px] object-contain drop-shadow-lg"
                    />
                </div>

                {/* Form */}
                <div className="w-full max-w-[420px] px-6">
                    <SignupForm onToggleMode={handleToggleMode} />
                </div>

                {/* Login link (visible on md+, SignupForm hides its own link on md+) */}
                <div className="relative z-10 mt-4 text-sm hidden md:block">
                    <span className="text-white/60">已有帳號？</span>{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-300 hover:text-blue-200 underline transition-colors"
                    >
                        立即登入
                    </Link>
                </div>
            </div>
        </div>
    )
}
