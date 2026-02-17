import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    default:
        'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    ghost:
        'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-400',
    outline:
        'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus-visible:ring-gray-400',
    destructive:
        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    link: 'bg-transparent text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500 p-0',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    default: 'h-9 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-10 px-6 text-base',
    icon: 'h-9 w-9 p-0',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
