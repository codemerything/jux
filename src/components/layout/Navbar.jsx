import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { navLinks } from '../../data/services';
import { PulseDot } from '../ui/Button';
import SmartLink from '../ui/SmartLink';

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

export default function Navbar({ hidden = false }) {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownLeft, setDropdownLeft] = useState(null);
    const [isCompact, setIsCompact] = useState(false);
    const [isLightOverlay, setIsLightOverlay] = useState(false);
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
            const navRect = navRef.current?.getBoundingClientRect();
            const probeY = navRect ? navRect.top + navRect.height * 0.5 : 64;
            const lightSectionIds = ['services', 'laptop-services'];
            const nextLightOverlay = lightSectionIds.some(sectionId => {
                const section = document.getElementById(sectionId);
                if (!section) {
                    return false;
                }

                const rect = section.getBoundingClientRect();
                return rect.top <= probeY && rect.bottom >= probeY;
            });

            setIsCompact(current => (current === nextCompact ? current : nextCompact));
            setIsLightOverlay(current => (current === nextLightOverlay ? current : nextLightOverlay));
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
        setMobileExpandedDropdown(null);
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
    const shellBorderColor = isLightOverlay ? 'rgba(15, 23, 42, 0.08)' : 'transparent';
    const logoClassName = isLightOverlay
        ? 'bg-[radial-gradient(circle_at_18%_18%,#d7d3c7_0%,#bdb8aa_34%,#979181_68%,#716c5f_100%)] bg-clip-text text-transparent [text-shadow:0_0_0.01px_rgba(113,108,95,0.18)]'
        : 'text-white';
    const desktopLinkClassName = isLightOverlay ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white';
    const mobileLinkClassName = isLightOverlay ? 'text-slate-700 hover:text-slate-950' : 'text-white/70 hover:text-white';
    const mobileDividerClassName = isLightOverlay ? 'border-black/10' : 'border-white/10';
    const mobileChipClassName = isLightOverlay
        ? 'border border-black/10 bg-black/[0.03] text-slate-700 hover:border-black/20 hover:bg-black/[0.06] hover:text-slate-950'
        : 'border border-white/12 bg-white/6 text-white/78 hover:border-white/22 hover:bg-white/10 hover:text-white';
    const ctaClassName = isLightOverlay ? 'bg-slate-950 text-white' : 'bg-white text-black';
    const mobileMenuBarClassName = isLightOverlay ? 'bg-slate-950' : 'bg-white';
    const isHomePage = location.pathname === '/';

    const resolveHref = href => {
        if (!href || href === '#') {
            return '/';
        }

        if (href === '#contact' || href === '/contact') {
            return '/contact';
        }

        if (href.startsWith('#')) {
            return isHomePage ? href : `/${href}`;
        }

        return href;
    };

    const getDropdownItemLabel = item => (typeof item === 'string' ? item : item.label);
    const getDropdownItemHref = (item, fallbackHref) => (typeof item === 'string' ? fallbackHref : item.href || fallbackHref);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-30 px-3 pt-3 transition-opacity duration-300 sm:px-4 sm:pt-4 ${
                hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
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
                        className="relative min-h-[60px] overflow-hidden rounded-[1.7rem] border px-3 py-2.5 backdrop-blur-xl sm:px-4"
                        style={{ borderColor: shellBorderColor }}
                    >
                        <motion.div
                            className="pointer-events-none absolute inset-0"
                            animate={{ opacity: isLightOverlay ? 0 : 1 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(0,0,0,0.29), rgba(0,0,0,0.29)), linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.09) 22%, rgba(255,255,255,0.03) 46%, rgba(255,255,255,0.018) 68%, rgba(255,255,255,0.05) 100%)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                        />
                        <motion.div
                            className="pointer-events-none absolute inset-0"
                            animate={{ opacity: isLightOverlay ? 1 : 0 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,0.23), rgba(255,255,255,0.23)), linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.28) 24%, rgba(255,255,255,0.14) 54%, rgba(255,255,255,0.06) 100%)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            }}
                        />
                        <div className={`relative z-10 flex min-h-9 items-center ${contentGap} ${contentRightPadding}`}>
                            <SmartLink href="/" className="shrink-0">
                                <span className={`text-2xl font-black leading-none tracking-tight transition-colors duration-300 ${logoClassName}`}>
                                    Jux Studio
                                </span>
                                <span className="hidden">
                                    ®
                                </span>
                            </SmartLink>

                            <AnimatePresence initial={false}>
                                {!isCompact && (
                                    <motion.div
                                        key="desktop-links"
                                        initial={{ opacity: 0, x: 18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                                        className="pointer-events-none absolute inset-x-0 top-0 hidden h-full items-center xl:flex"
                                    >
                                        <div className="pointer-events-none mx-auto flex w-full max-w-4xl items-center px-3 sm:px-4 md:px-6">
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
                                                        <SmartLink
                                                            href={resolveHref(link.href)}
                                                            className={`flex items-center gap-1 py-1.5 pr-3 text-[13px] font-medium transition-all duration-150 ${desktopLinkClassName} ${index === 0 ? 'pl-0' : 'pl-3'}`}
                                                        >
                                                            {link.label}
                                                            <ChevronDown />
                                                        </SmartLink>
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
                                                <SmartLink
                                                    href={resolveHref(link.href)}
                                                    className={`flex items-center gap-1 py-1.5 pr-2.5 text-[13px] font-medium transition-all duration-150 ${desktopLinkClassName} ${index === 0 ? 'pl-0' : 'pl-2.5'}`}
                                                >
                                                    {link.label}
                                                    <ChevronDown />
                                                </SmartLink>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isCompact && <div className="flex-1" />}

                            <button
                                className="flex flex-col gap-1.5 p-1.5 xl:hidden"
                                onClick={() => {
                                    setIsMobileMenuOpen(current => {
                                        const nextIsOpen = !current;
                                        if (!nextIsOpen) {
                                            setMobileExpandedDropdown(null);
                                        }
                                        return nextIsOpen;
                                    });
                                }}
                                aria-label="Toggle menu"
                            >
                                <span className={`h-0.5 w-6 transition-all duration-300 ${mobileMenuBarClassName} ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                                <span className={`h-0.5 w-6 transition-all duration-300 ${mobileMenuBarClassName} ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`h-0.5 w-6 transition-all duration-300 ${mobileMenuBarClassName} ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                            </button>
                        </div>

                        <SmartLink
                            href="/contact"
                            className={`absolute right-[7px] top-1/2 z-20 hidden h-9 -translate-y-1/2 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all duration-300 hover:scale-105 xl:inline-flex sm:right-[11px] ${ctaClassName}`}
                        >
                            <PulseDot />
                            Book a Call
                        </SmartLink>

                        {isMobileMenuOpen && (
                            <div className={`relative z-10 mt-3 border-t pt-3 xl:hidden ${mobileDividerClassName}`}>
                                <div className="space-y-2.5">
                                    {headerLinks.map((link, index) => {
                                        if (!link.dropdown) {
                                            return (
                                                <SmartLink
                                                    key={index}
                                                    href={resolveHref(link.href)}
                                                    className={`block py-1 text-base font-medium transition-colors ${mobileLinkClassName}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {link.label}
                                                </SmartLink>
                                            );
                                        }

                                        const isExpanded = mobileExpandedDropdown === index;
                                        const mobileDropdownItems = link.dropdown.flatMap(section => (
                                            section.items.map(item => ({
                                                label: getDropdownItemLabel(item),
                                                href: getDropdownItemHref(item, link.href),
                                            }))
                                        ));

                                        return (
                                            <div key={index} className="py-1">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center justify-between text-left text-base font-medium transition-colors ${mobileLinkClassName}`}
                                                    onClick={() => {
                                                        setMobileExpandedDropdown(current => current === index ? null : index);
                                                    }}
                                                >
                                                    <span>{link.label}</span>
                                                    <motion.span
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                                        className="text-white/45"
                                                    >
                                                        <ChevronDown />
                                                    </motion.span>
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                            transition={{ duration: 0.22, ease: 'easeOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex flex-wrap gap-2 pr-2">
                                                                {mobileDropdownItems.map(item => (
                                                                    <SmartLink
                                                                        key={item.href}
                                                                        href={resolveHref(item.href)}
                                                                        className={`inline-flex rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${mobileChipClassName}`}
                                                                        onClick={() => {
                                                                            setIsMobileMenuOpen(false);
                                                                            setMobileExpandedDropdown(null);
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                    </SmartLink>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                    <SmartLink
                                        href="/contact"
                                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${ctaClassName}`}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setMobileExpandedDropdown(null);
                                        }}
                                    >
                                        <PulseDot />
                                        Book a Call
                                    </SmartLink>
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
                                                    <SmartLink
                                                        key={itemIndex}
                                                        href={resolveHref(getDropdownItemHref(item, activeDropdown.href))}
                                                        className="block text-[13px] text-white/70 transition-colors hover:text-white"
                                                    >
                                                        {getDropdownItemLabel(item)}
                                                    </SmartLink>
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
