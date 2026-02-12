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
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">註冊 TravelDot</h2>

            {(error || formError) && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {formError || error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
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
                            "w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2",
                            fieldErrors.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        )}
                        placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">密碼</label>
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
                            "w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2",
                            fieldErrors.password
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        )}
                        placeholder="至少 8 個字元"
                    />
                    {fieldErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">確認密碼</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="再次輸入密碼"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !!fieldErrors.email || !!fieldErrors.password || !email || !password}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '註冊'}
                </button>
            </form>

            <div className="text-sm text-center">
                <span className="text-gray-600">已有帳號？</span>{' '}
                <button
                    onClick={onToggleMode}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    登入
                </button>
            </div>
        </div>
    );
}
