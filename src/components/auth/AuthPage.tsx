import { useState } from 'react';
import logoAuth from '@/assets/logo_auth.png';
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
