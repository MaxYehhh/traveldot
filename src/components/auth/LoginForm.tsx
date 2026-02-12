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
            <div
                className="w-full max-w-sm p-8 rounded-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
                <h2 className="text-2xl font-bold text-center text-white">重設密碼</h2>
                <p className="text-sm text-white/60 text-center">輸入您的 Email，我們將寄送重設連結給您。</p>

                {error && (
                    <div className="p-3 text-sm text-red-200 bg-red-500/20 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/80">Email</label>
                        <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-1 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setShowForgot(false); clearError(); }}
                            className="w-full py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '發送重設連結'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div
            className="w-full max-w-sm p-8 rounded-2xl space-y-6"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
            <h2 className="md:hidden text-2xl font-bold text-white text-center mb-2">登入 TravelDot</h2>

            {error && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 mt-1 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/80">密碼</label>
                    <input
                        ref={passwordInputRef}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 mt-1 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="••••••••"
                    />
                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        >
                            忘記密碼？
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '登入'}
                </button>
            </form>

            <div className="text-sm text-center">
                <span className="text-white/60">還沒有帳號？</span>{' '}
                <button
                    onClick={onToggleMode}
                    className="font-medium text-blue-300 hover:text-blue-200 underline transition-colors"
                >
                    註冊新帳號
                </button>
            </div>
        </div>
    );
}
