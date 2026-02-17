import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

const features = [
    {
        emoji: '🗺️',
        title: '地圖記錄',
        description: '精確記錄每個地點，在地圖上留下你的足跡',
    },
    {
        emoji: '📸',
        title: '照片串聯',
        description: '將照片與地點綁定，讓記憶栩栩如生',
    },
    {
        emoji: '✈️',
        title: '旅程整理',
        description: '輕鬆管理多段旅程，讓每趟旅行都有完整故事',
    },
]

export default function HomePage() {
    const navigate = useNavigate()
    const currentUser = useAuthStore((s) => s.currentUser)

    const handleCtaClick = () => {
        if (currentUser) {
            navigate('/map')
        } else {
            navigate('/register')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm h-16 flex items-center px-6 md:px-12">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    {/* Logo */}
                    <span className="text-xl font-bold text-blue-600 select-none">
                        📍 TravelDot
                    </span>

                    {/* Right side nav actions */}
                    <div className="flex items-center gap-3">
                        {currentUser ? (
                            <button
                                onClick={() => navigate('/map')}
                                className="
                                    px-5 py-2 rounded-lg text-sm font-medium
                                    bg-blue-600 text-white
                                    hover:bg-blue-700
                                    transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                "
                            >
                                前往地圖 →
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="
                                        px-4 py-2 rounded-lg text-sm font-medium
                                        border border-blue-600 text-blue-600
                                        hover:bg-blue-50
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    "
                                >
                                    登入
                                </Link>
                                <Link
                                    to="/register"
                                    className="
                                        px-4 py-2 rounded-lg text-sm font-medium
                                        bg-blue-600 text-white
                                        hover:bg-blue-700
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    "
                                >
                                    註冊
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                className="
                    min-h-[calc(100vh-64px)] flex items-center justify-center
                    bg-gradient-to-b from-blue-50 via-white to-indigo-50
                    px-6 md:px-12
                "
            >
                <div className="max-w-3xl mx-auto text-center py-20 md:py-28">
                    <h1
                        className="
                            font-extrabold text-gray-900 leading-tight
                            text-5xl md:text-7xl
                            mb-6
                        "
                    >
                        Every Dot Tells a Story
                    </h1>

                    <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                        用地圖記錄每一個旅行瞬間，讓每個足跡都成為故事
                    </p>

                    <p className="text-base text-gray-500 mb-10">
                        30 秒完成記錄，讓旅途中的每個地點都留下印記
                    </p>

                    <button
                        onClick={handleCtaClick}
                        className="
                            px-8 py-4 text-lg font-semibold rounded-full
                            bg-blue-600 text-white
                            hover:bg-blue-700
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            shadow-lg hover:shadow-xl
                            @media (prefers-reduced-motion: reduce) { transition: none; }
                        "
                    >
                        {currentUser ? '前往地圖 →' : '立即開始 →'}
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                        為什麼選擇 TravelDot？
                    </h2>
                    <p className="text-center text-gray-500 mb-12 text-lg">
                        簡單、直覺、讓旅行記憶永久保存
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="
                                    bg-white rounded-xl p-6 shadow-md
                                    hover:shadow-lg hover:-translate-y-1
                                    transition-all duration-200
                                    border border-gray-100
                                    text-center
                                "
                            >
                                <div className="text-4xl mb-4">{feature.emoji}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-50 border-t border-gray-100 mt-auto">
                <p className="text-center text-gray-400 text-sm">
                    © 2024 TravelDot. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
