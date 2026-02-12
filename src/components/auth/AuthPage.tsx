import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {isLogin ? (
                <LoginForm onToggleMode={toggleMode} />
            ) : (
                <SignupForm onToggleMode={toggleMode} />
            )}
        </div>
    );
}
