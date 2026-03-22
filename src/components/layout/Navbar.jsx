import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '../../data/services';
import { PulseDot } from '../ui/Button';

const shellTransition = {
    type: 'spring',
    stiffness: 150,
    damping: 24,
    mass: 1,
};

const COMPACT_WIDTH = 264;
const COMPACT_PREVIEW_WIDTH = 544;

function ChevronDown() {
    return (
        <svg className="mt-px h-3 w-3 shrink-0 opacity-50" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownLeft, setDropdownLeft] = useState(null);
    const [isCompact, setIsCompact] = useState(false);
    const [isCompactHovered, setIsCompactHovered] = useState(false);
    const [isCompactPreviewReady, setIsCompactPreviewReady] = useState(false);
    const navRef = useRef(null);
    const triggerRefs = useRef([]);
    const compactHoverTimeoutRef = useRef(null);
    const compactPreviewReadyTimeoutRef = useRef(null);
    const dropdownCloseTimeoutRef = useRef(null);
    const headerLinks = navLinks.filter(link => !['Contact', 'Work'].includes(link.label));

    useEffect(() => {
        let frameId = null;

        const syncCompactState = () => {
            const desktop = window.matchMedia('(min-width: 1280px)').matches;
            const nextCompact = desktop && window.scrollY > 180;

            setIsCompact(current => (current === nextCompact ? current : nextCompact));
            frameId = null;
        };

        const requestSync = () => {
            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(syncCompactState);
        };

        requestSync();
        window.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);

        return () => {
            window.removeEventListener('scroll', requestSync);
            window.removeEventListener('resize', requestSync);

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, []);

    useEffect(() => {
        if (!isCompact) {
            return;
        }

        setOpenDropdown(null);
        setDropdownLeft(null);
        setIsMobileMenuOpen(false);
        setIsCompactHovered(false);
        setIsCompactPreviewReady(false);
    }, [isCompact]);

    useEffect(() => {
        return () => {
            if (compactHoverTimeoutRef.current) {
                window.clearTimeout(compactHoverTimeoutRef.current);
            }

            if (compactPreviewReadyTimeoutRef.current) {
                window.clearTimeout(compactPreviewReadyTimeoutRef.current);
            }

            if (dropdownCloseTimeoutRef.current) {
                window.clearTimeout(dropdownCloseTimeoutRef.current);
            }
        };
    }, []);

    const cancelDropdownClose = () => {
        if (dropdownCloseTimeoutRef.current) {
            window.clearTimeout(dropdownCloseTimeoutRef.current);
            dropdownCloseTimeoutRef.current = null;
        }
    };

    const scheduleDropdownClose = () => {
        cancelDropdownClose();
        dropdownCloseTimeoutRef.current = window.setTimeout(() => {
            setOpenDropdown(null);
            setDropdownLeft(null);
            dropdownCloseTimeoutRef.current = null;
        }, 120);
    };

    const handleDropdownEnter = index => {
        const navElement = navRef.current;
        const triggerElement = triggerRefs.current[index];

        cancelDropdownClose();

        if (isCompact && !isCompactPreviewReady) {
            return;
        }

        if (!navElement || !triggerElement) {
            setOpenDropdown(index);
            return;
        }

        const navRect = navElement.getBoundingClientRect();
        const triggerRect = triggerElement.getBoundingClientRect();
        const triggerLink = triggerElement.querySelector('a');
        const triggerPaddingLeft = triggerLink ? Number.parseFloat(window.getComputedStyle(triggerLink).paddingLeft) || 0 : 0;

        setDropdownLeft(triggerRect.left - navRect.left + triggerPaddingLeft);
        setOpenDropdown(index);
    };

    const activeDropdown = openDropdown !== null ? headerLinks[openDropdown] : null;
    const compactPreviewOpen = isCompact && isCompactHovered;
    const contentRightPadding = !isCompact
        ? 'xl:pr-[8.75rem] 2xl:pr-[9.25rem]'
        : compactPreviewOpen
            ? 'xl:pr-[8.75rem] 2xl:pr-[9.25rem]'
            : 'xl:pr-[7rem] 2xl:pr-[7.5rem]';
    const contentGap = isCompact && !compactPreviewOpen ? 'gap-3' : 'gap-2.5';
    const shellWidth = !isCompact ? '100%' : compactPreviewOpen ? COMPACT_PREVIEW_WIDTH : COMPACT_WIDTH;

    return (
        <nav
            className="fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4"
            onMouseEnter={() => {
                if (isCompact) {
                    if (compactHoverTimeoutRef.current) {
                        window.clearTimeout(compactHoverTimeoutRef.current);
                    }

                    if (compactPreviewReadyTimeoutRef.current) {
                        window.clearTimeout(compactPreviewReadyTimeoutRef.current);
                        compactPreviewReadyTimeoutRef.current = null;
                    }

                    compactHoverTimeoutRef.current = window.setTimeout(() => {
                        setIsCompactHovered(true);
                        compactHoverTimeoutRef.current = null;

                        compactPreviewReadyTimeoutRef.current = window.setTimeout(() => {
                            setIsCompactPreviewReady(true);
                            compactPreviewReadyTimeoutRef.current = null;
                        }, 260);
                    }, 110);
                }
            }}
            onMouseLeave={() => {
                if (compactHoverTimeoutRef.current) {
                    window.clearTimeout(compactHoverTimeoutRef.current);
                    compactHoverTimeoutRef.current = null;
                }

                if (compactPreviewReadyTimeoutRef.current) {
                    window.clearTimeout(compactPreviewReadyTimeoutRef.current);
                    compactPreviewReadyTimeoutRef.current = null;
                }

                cancelDropdownClose();

                setIsCompactHovered(false);
                setIsCompactPreviewReady(false);
                setOpenDropdown(null);
                setDropdownLeft(null);
            }}
        >
            <div className="flex w-full justify-end">
                <motion.div
                    animate={{
                        width: shellWidth,
                    }}
                    transition={shellTransition}
                    className={`relative ml-auto ${isCompact ? '' : 'w-full'}`}
                >
                    <div
                        ref={navRef}
                        className="relative min-h-[60px] overflow-hidden rounded-2xl border border-transparent bg-black/38 px-3 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38)), linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.09) 22%, rgba(255,255,255,0.03) 46%, rgba(255,255,255,0.018) 68%, rgba(255,255,255,0.05) 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <div className={`flex min-h-9 items-center ${contentGap} ${contentRightPadding}`}>
                            <a href="#" className="shrink-0">
                                <span className="text-2xl font-black leading-none tracking-tight text-white">
                                    Jux Studio
                                </span>
                                <span className="hidden">
                                    ®
                                </span>
                            </a>

                            <AnimatePresence initial={false}>
                                {!isCompact && (
                                    <motion.div
                                        key="desktop-links"
                                        initial={{ opacity: 0, x: 18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                                        className="pointer-events-none absolute inset-x-0 top-0 hidden h-full items-center xl:flex"
                                    >
                                        <div className="mx-auto flex w-full max-w-4xl items-center px-3 sm:px-4 md:px-6">
                                            <div className="pointer-events-auto flex items-center gap-1.5">
                                                {headerLinks.map((link, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                        ref={element => {
                                                            triggerRefs.current[index] = element;
                                                        }}
                                                        onMouseEnter={() => {
                                                            if (link.dropdown) {
                                                                handleDropdownEnter(index);
                                                            } else {
                                                                cancelDropdownClose();
                                                                setOpenDropdown(null);
                                                                setDropdownLeft(null);
                                                            }
                                                        }}
                                                        onMouseLeave={() => {
                                                            if (link.dropdown) {
                                                                scheduleDropdownClose();
                                                            }
                                                        }}
                                                    >
                                                        <a
                                                            href={link.href}
                                                            className={`flex items-center gap-1 py-1.5 pr-3 text-[13px] font-medium text-white/70 transition-all duration-150 hover:text-white ${index === 0 ? 'pl-0' : 'pl-3'}`}
                                                        >
                                                            {link.label}
                                                            <ChevronDown />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {compactPreviewOpen && (
                                    <motion.div
                                        key="compact-links"
                                        initial={{ opacity: 0, x: 18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 16, transition: { duration: 0.22, ease: 'easeOut' } }}
                                        transition={{ duration: 0.24, ease: 'easeOut' }}
                                        className="hidden items-center gap-1.5 xl:flex"
                                    >
                                        {headerLinks.map((link, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                                ref={element => {
                                                    triggerRefs.current[index] = element;
                                                }}
                                                onMouseEnter={() => {
                                                    if (link.dropdown) {
                                                        handleDropdownEnter(index);
                                                    } else {
                                                        cancelDropdownClose();
                                                        setOpenDropdown(null);
                                                        setDropdownLeft(null);
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    if (link.dropdown) {
                                                        scheduleDropdownClose();
                                                    }
                                                }}
                                            >
                                                <a
                                                    href={link.href}
                                                    className={`flex items-center gap-1 py-1.5 pr-2.5 text-[13px] font-medium text-white/70 transition-all duration-150 hover:text-white ${index === 0 ? 'pl-0' : 'pl-2.5'}`}
                                                >
                                                    {link.label}
                                                    <ChevronDown />
                                                </a>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isCompact && <div className="flex-1" />}

                            <button
                                className="flex flex-col gap-1.5 p-1.5 xl:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                            </button>
                        </div>

                        <a
                            href="#contact"
                            className="absolute right-3 top-1/2 hidden h-9 -translate-y-1/2 items-center gap-1.5 rounded-lg bg-white px-4 text-[13px] font-semibold text-black transition-transform duration-300 hover:scale-105 xl:inline-flex sm:right-4"
                        >
                            <PulseDot />
                            Book a Call
                        </a>

                        {isMobileMenuOpen && (
                            <div className="mt-3 border-t border-white/10 pt-3 xl:hidden">
                                <div className="space-y-2.5">
                                    {headerLinks.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.href}
                                            className="block py-1 text-base font-medium text-white/70 hover:text-white"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                    <a
                                        href="#contact"
                                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <PulseDot />
                                        Book a Call
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {activeDropdown?.dropdown && dropdownLeft !== null && (!isCompact || isCompactPreviewReady) && (
                            <motion.div
                                key="dropdown"
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="absolute top-full z-50 hidden pt-2 xl:block"
                                style={{
                                    left: dropdownLeft,
                                }}
                                onMouseEnter={cancelDropdownClose}
                                onMouseLeave={scheduleDropdownClose}
                            >
                                <div
                                    className="flex min-w-[248px] gap-8 overflow-hidden rounded-[1.125rem] border border-white/10 bg-black/38 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                                    style={{
                                        backdropFilter: 'blur(24px)',
                                        WebkitBackdropFilter: 'blur(24px)',
                                    }}
                                >
                                    {activeDropdown.dropdown.map((section, sectionIndex) => (
                                        <div key={sectionIndex}>
                                            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                                {section.section}
                                            </span>
                                            <div className="space-y-1.5">
                                                {section.items.map((item, itemIndex) => (
                                                    <a
                                                        key={itemIndex}
                                                        href="#services"
                                                        className="block text-[13px] text-white/70 transition-colors hover:text-white"
                                                    >
                                                        {item}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </nav>
    );
}
