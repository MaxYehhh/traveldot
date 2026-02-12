import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormProps {
    onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const { signup, loading, error } = useAuthStore();

    // Validation functions
    const validateEmail = (email: string): string | undefined => {
        if (!email) return '請輸入 Email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return '請輸入有效的 Email';
        }
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return '請輸入密碼';
        if (password.length < 8) {
            return '密碼至少需要 8 個字元';
        }
        return undefined;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validate all fields
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setFieldErrors({ email: emailError, password: passwordError });
            return;
        }

        if (password !== confirmPassword) {
            setFormError('密碼不一致');
            return;
        }

        try {
            await signup(email, password);
        } catch (err) {
            // Error is handled in store
        }
    };

    return (
        <div
            className="w-full max-w-sm p-8 rounded-2xl space-y-6"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
            <h2 className="md:hidden text-2xl font-bold text-white text-center mb-2">註冊 TravelDot</h2>

            {(error || formError) && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 rounded-xl">
                    {formError || error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/80">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setFieldErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        onBlur={() => {
                            const error = validateEmail(email);
                            setFieldErrors(prev => ({ ...prev, email: error }));
                        }}
                        className={cn(
                            "w-full px-4 py-3 mt-1 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 text-sm",
                            fieldErrors.email
                                ? "ring-2 ring-red-400"
                                : "border-0 focus:ring-blue-400"
                        )}
                        placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                        <p className="text-red-300 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/80">密碼</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setFieldErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        onBlur={() => {
                            const error = validatePassword(password);
                            setFieldErrors(prev => ({ ...prev, password: error }));
                        }}
                        className={cn(
                            "w-full px-4 py-3 mt-1 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 text-sm",
                            fieldErrors.password
                                ? "ring-2 ring-red-400"
                                : "border-0 focus:ring-blue-400"
                        )}
                        placeholder="至少 8 個字元"
                    />
                    {fieldErrors.password && (
                        <p className="text-red-300 text-xs mt-1">{fieldErrors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/80">確認密碼</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 mt-1 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="再次輸入密碼"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !!fieldErrors.email || !!fieldErrors.password || !email || !password}
                    className="w-full flex justify-center py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '註冊'}
                </button>
            </form>

            <div className="text-sm text-center">
                <span className="text-white/60">已有帳號？</span>{' '}
                <button
                    onClick={onToggleMode}
                    className="font-medium text-blue-300 hover:text-blue-200 underline transition-colors"
                >
                    登入
                </button>
            </div>
        </div>
    );
}
