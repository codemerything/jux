export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    className = '',
    ...props
}) {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer';

    const variants = {
        primary: 'bg-white text-gray-900 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]',
        secondary: 'bg-transparent text-white border border-white/10 hover:bg-white/10',
        dark: 'bg-gray-900 text-white hover:-translate-y-0.5 hover:shadow-lg'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

// Green pulsing dot component
export function PulseDot({ className = '' }) {
    return (
        <span
            className={`w-2 h-2 bg-green-500 rounded-full animate-[pulse-dot_2s_infinite] ${className}`}
        />
    );
}
