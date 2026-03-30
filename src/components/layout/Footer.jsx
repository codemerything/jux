export default function Footer() {
    return (
        <footer className="bg-transparent border-t border-white/5 py-5 snap-section-end">
            <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between gap-8 flex-wrap">
                <p className="text-white/30 whitespace-nowrap" style={{ fontSize: 'var(--text-xs)' }}>
                    &copy; 2026 Jux Studio
                </p>

                <nav className="flex items-center gap-6">
                    {['Terms & Conditions', 'Privacy Policy', 'Cookies', 'Sitemap'].map(item => (
                        <a
                            key={item}
                            href="#"
                            className="text-white/30 hover:text-white/60 transition-colors whitespace-nowrap"
                            style={{ fontSize: 'var(--text-xs)' }}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                <nav className="flex items-center gap-6">
                    {['Instagram', 'LinkedIn', 'Twitter', 'Youtube'].map(item => (
                        <a
                            key={item}
                            href="#"
                            className="text-white/30 hover:text-white/60 transition-colors whitespace-nowrap"
                            style={{ fontSize: 'var(--text-xs)' }}
                        >
                            {item}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
