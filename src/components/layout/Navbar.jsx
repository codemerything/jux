import { useState } from 'react';
import { navLinks } from '../../data/services';
import { PulseDot } from '../ui/Button';

function ChevronDown() {
    return (
        <svg className="w-3 h-3 opacity-50 mt-px shrink-0" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    return (
        <>
            <nav className="relative bg-black py-5">
                {/* Full-width row: logo far left, mobile toggle */}
                <div className="w-full px-6 flex items-center">
                    {/* Logo — larger, bold, white, far left */}
                    <a href="#" className="flex items-baseline shrink-0">
                        <span className="text-2xl font-black tracking-tight text-white leading-none">
                            Jux Studio
                        </span>
                        <span className="text-accent text-sm ml-1 font-bold">®</span>
                    </a>

                    <div className="flex-1" />

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                <div className="absolute inset-0 hidden lg:flex items-center pointer-events-none">
                    <div className="max-w-4xl mx-auto px-8 w-full flex items-center">
                        <div className="flex items-center gap-2 pointer-events-auto">
                            {navLinks.filter(l => l.label !== 'Contact').map((link, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => link.dropdown && setOpenDropdown(index)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white bg-white/8 hover:bg-white/15 px-4 py-2 rounded-lg transition-all duration-150"
                                    >
                                        {link.label}
                                        <ChevronDown />
                                    </a>

                                    {/* Dropdown */}
                                    {link.dropdown && openDropdown === index && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                                            <div className="bg-gray-900 rounded-xl p-5 flex gap-10 shadow-2xl min-w-[280px] border border-white/10">
                                                {link.dropdown.map((section, sIdx) => (
                                                    <div key={sIdx}>
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2.5 block">
                                                            {section.section}
                                                        </span>
                                                        <div className="space-y-2">
                                                            {section.items.map((item, iIdx) => (
                                                                <a
                                                                    key={iIdx}
                                                                    href="#services"
                                                                    className="block text-[13px] text-white/70 hover:text-white transition-colors"
                                                                >
                                                                    {item}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-white/10 bg-black">
                        <div className="px-6 py-5 space-y-3">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="block text-base font-medium text-white/70 hover:text-white py-1.5"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold mt-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <PulseDot />
                                Book a Call
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Floating Book a Call — fixed, mix-blend-mode: difference for inversion effect */}
            <div
                className="fixed top-4 right-6 z-[9998] hidden lg:block"
                style={{ mixBlendMode: 'difference' }}
            >
                <a
                    href="#contact"
                    className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold
                        transition-all duration-300 hover:scale-105"
                >
                    <PulseDot />
                    Book a Call
                </a>
            </div>
        </>
    );
}
