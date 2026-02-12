import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
    onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const { login, resetPassword, loading, error, clearError } = useAuthStore();
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            // AC-006: Clear password and focus back
            setPassword('');
            passwordInputRef.current?.focus();
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) return;
        try {
            await resetPassword(forgotEmail);
            alert('重設連結已發送到您的信箱'); // AC-008: Success message
            setShowForgot(false);
        } catch (err) {
            // Error handled in store/UI
        }
    };

    if (showForgot) {
        return (
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-center text-gray-900">重設密碼</h2>
                <p className="text-sm text-gray-500 text-center">輸入您的 Email，我們將寄送重設連結給您。</p>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setShowForgot(false); clearError(); }}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '發送重設連結'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">登入 TravelDot</h2>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">密碼</label>
                    <input
                        ref={passwordInputRef}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-xs text-blue-600 hover:text-blue-500"
                        >
                            忘記密碼？
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '登入'}
                </button>
            </form>

            <div className="text-sm text-center">
                <span className="text-gray-600">還沒有帳號？</span>{' '}
                <button
                    onClick={onToggleMode}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    註冊新帳號
                </button>
            </div>
        </div>
    );
}
