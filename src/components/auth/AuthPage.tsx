import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="h-screen w-screen overflow-hidden relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80)' }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20" />

            {/* Content: two-column */}
            <div className="relative z-10 flex h-full">
                {/* Left: Brand */}
                <div className="hidden md:flex flex-col justify-center flex-1 px-12 lg:px-20">
                    <p className="text-white text-3xl font-bold tracking-wide mb-3">TravelDot</p>
                    <p className="text-white/70 text-lg italic">Every Dot Tells a Story.</p>
                </div>

                {/* Right: Form */}
                <div className="flex items-center justify-center w-full md:w-[420px] lg:w-[460px] shrink-0 px-6 md:px-0 md:pr-12">
                    {isLogin ? (
                        <LoginForm onToggleMode={toggleMode} />
                    ) : (
                        <SignupForm onToggleMode={toggleMode} />
                    )}
                </div>
            </div>
        </div>
    );
}
