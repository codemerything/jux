import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { phoneServices } from '../../data/services';
import MediaLightbox from '../ui/MediaLightbox';

const phoneSlideEntries = Object.entries(
    import.meta.glob('../../../heroImages/phoneslides/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}', {
        eager: true,
        import: 'default',
    })
)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([path, src]) => ({
        path,
        src,
    }));

const isVideoSlide = (path) => /\.(mp4|webm|mov)$/i.test(path);

const phoneSlideImages = phoneSlideEntries
    .filter(({ path }) => !isVideoSlide(path))
    .map(({ src }) => src);

const phoneSlideVideos = phoneSlideEntries
    .filter(({ path }) => isVideoSlide(path))
    .map(({ src }) => src);

const phonePreviewSlides = phoneSlideEntries
    .map(({ path, src }) => ({
        type: isVideoSlide(path) ? 'video' : 'image',
        src,
        alt: '',
    }))
    .filter(slide => Boolean(slide.src));

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getStaggeredProgress = (progress, delay = 0) => (
    clamp((progress - delay) / Math.max(0.0001, 1 - delay))
);

const getRevealStyle = (progress, distance = 28) => ({
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
});

const getViewportHeight = () => {
    if (typeof window === 'undefined') {
        return 0;
    }

    return window.visualViewport?.height ?? window.innerHeight;
};

const subscribeViewportChanges = (callback) => {
    if (typeof window === 'undefined') {
        return () => {};
    }

    window.addEventListener('resize', callback);
    window.addEventListener('orientationchange', callback);

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', callback);

    return () => {
        window.removeEventListener('resize', callback);
        window.removeEventListener('orientationchange', callback);
        viewport?.removeEventListener('resize', callback);
    };
};

const useMobileRevealProgress = (targetRef, { start = 0.72, end = 0.42 } = {}) => {
    const [progress, setProgress] = useState(() => (
        typeof window === 'undefined' || window.innerWidth >= 768 ? 1 : 0
    ));

    useEffect(() => {
        let frameId = null;

        const syncProgress = () => {
            frameId = null;

            if (typeof window === 'undefined' || window.innerWidth >= 768) {
                setProgress(1);
                return;
            }

            const element = targetRef.current;
            if (!element) {
                setProgress(0);
                return;
            }

            const viewportHeight = getViewportHeight();
            const startLine = viewportHeight * start;
            const endLine = viewportHeight * end;
            const nextProgress = clamp(
                (startLine - element.getBoundingClientRect().top) / (startLine - endLine)
            );

            setProgress((current) => (
                Math.abs(current - nextProgress) < 0.01 ? current : nextProgress
            ));
        };

        const requestSync = () => {
            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(syncProgress);
        };

        requestSync();
        window.addEventListener('scroll', requestSync, { passive: true });
        const unsubscribeViewportChanges = subscribeViewportChanges(requestSync);

        return () => {
            window.removeEventListener('scroll', requestSync);
            unsubscribeViewportChanges();

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [end, start, targetRef]);

    return progress;
};

function EyeIcon() {
    return (
        <svg viewBox="0 0 20 20" className="h-[1.1rem] w-[1.1rem]" fill="none" aria-hidden="true">
            <path
                d="M1.75 10s3.05-5 8.25-5 8.25 5 8.25 5-3.05 5-8.25 5-8.25-5-8.25-5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="10" cy="10" r="2.35" fill="currentColor" />
        </svg>
    );
}

function PhonePreviewButton({ onClick, className = '', compact = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Open phone preview gallery"
            className={`flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/92 text-gray-700 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-md transition-colors duration-300 hover:border-gray-300 hover:bg-white hover:text-gray-900 ${compact ? 'h-11 w-11' : 'h-11 px-4'} ${className}`}
        >
            <EyeIcon />
            {!compact && <span className="text-[12px] font-semibold tracking-[0.18em] uppercase">Preview</span>}
        </button>
    );
}

export default function Services({ isPreviewOpen = false, onOpenPreview, onClosePreview }) {
    const [activeService, setActiveService] = useState(1);
    const [shouldLoadPhoneMedia, setShouldLoadPhoneMedia] = useState(false);
    const [previewBounds, setPreviewBounds] = useState(null);
    const cardsRef = useRef([]);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const ruleRef = useRef(null);
    const lastScrollYRef = useRef(0);
    const lastServiceChangeScrollYRef = useRef(0);
    const previewOpenFrameRef = useRef(null);
    const sectionSnapTimeoutRef = useRef(null);
    const serviceSnapTimeoutRef = useRef(null);
    const sectionSnapReleaseTimeoutRef = useRef(null);
    const sectionSnapStateRef = useRef({
        isProgrammaticScroll: false,
        lastObservedScrollY: 0,
        lastScrollDirection: 1,
        lastSnapScrollY: Number.NEGATIVE_INFINITY,
        lastSnapTimestamp: 0,
    });
    const lastServiceId = phoneServices[phoneServices.length - 1]?.id ?? 1;
    const headerRevealProgress = useMobileRevealProgress(headerRef, { start: 0.58, end: 0.18 });
    const headerLineOneProgress = getStaggeredProgress(headerRevealProgress, 0);
    const headerLineTwoProgress = getStaggeredProgress(headerRevealProgress, 0.18);
    const headerRuleProgress = getStaggeredProgress(headerRevealProgress, 0.32);

    const lockSectionSnap = (duration = 760) => {
        sectionSnapStateRef.current.isProgrammaticScroll = true;

        if (sectionSnapReleaseTimeoutRef.current !== null) {
            window.clearTimeout(sectionSnapReleaseTimeoutRef.current);
        }

        sectionSnapReleaseTimeoutRef.current = window.setTimeout(() => {
            sectionSnapStateRef.current.isProgrammaticScroll = false;
            sectionSnapReleaseTimeoutRef.current = null;
        }, duration);
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || shouldLoadPhoneMedia) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoadPhoneMedia(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '320px 0px',
            }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [shouldLoadPhoneMedia]);

    useEffect(() => {
        if (!isPreviewOpen) {
            setPreviewBounds(null);
            return undefined;
        }

        const syncPreviewBounds = () => {
            const section = sectionRef.current;
            if (!section) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const top = Math.max(0, rect.top);
            const bottom = Math.min(window.innerHeight, rect.bottom);
            const height = Math.max(0, bottom - top);

            setPreviewBounds({
                top,
                left: Math.max(0, rect.left),
                width: Math.max(0, Math.min(window.innerWidth, rect.width)),
                height,
            });
        };

        syncPreviewBounds();
        window.addEventListener('resize', syncPreviewBounds);
        window.addEventListener('scroll', syncPreviewBounds, { passive: true });

        return () => {
            window.removeEventListener('resize', syncPreviewBounds);
            window.removeEventListener('scroll', syncPreviewBounds);
        };
    }, [isPreviewOpen]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const snapState = sectionSnapStateRef.current;
        snapState.lastObservedScrollY = window.scrollY;

        const maybeSnapSectionToTop = () => {
            const section = sectionRef.current;
            if (!section || isPreviewOpen) {
                return;
            }

            const viewportHeight = getViewportHeight();
            const currentScrollY = window.scrollY;
            const scrollingDown = snapState.lastScrollDirection >= 0;

            if (!scrollingDown || snapState.isProgrammaticScroll) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const snapThreshold = Math.min(360, viewportHeight * 0.38);
            const overshootAllowance = Math.min(96, viewportHeight * 0.11);
            const snapCooldownElapsed = Date.now() - snapState.lastSnapTimestamp > 1200;
            const travelSinceLastSnap = Math.abs(currentScrollY - snapState.lastSnapScrollY);
            const isWithinSnapZone = rect.top <= snapThreshold && rect.top >= -overshootAllowance;

            if (isWithinSnapZone && snapCooldownElapsed && travelSinceLastSnap > 80) {
                const targetScrollTop = Math.max(0, Math.round(currentScrollY + rect.top));
                snapState.lastSnapScrollY = currentScrollY;
                snapState.lastSnapTimestamp = Date.now();
                lockSectionSnap(760);
                window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
            }
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            snapState.lastScrollDirection = currentScrollY - snapState.lastObservedScrollY >= -1 ? 1 : -1;
            snapState.lastObservedScrollY = currentScrollY;

            if (sectionSnapTimeoutRef.current !== null) {
                window.clearTimeout(sectionSnapTimeoutRef.current);
            }

            sectionSnapTimeoutRef.current = window.setTimeout(() => {
                sectionSnapTimeoutRef.current = null;
                maybeSnapSectionToTop();
            }, 130);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        const unsubscribeViewportChanges = subscribeViewportChanges(handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribeViewportChanges();

            if (sectionSnapTimeoutRef.current !== null) {
                window.clearTimeout(sectionSnapTimeoutRef.current);
                sectionSnapTimeoutRef.current = null;
            }
        };
    }, [isPreviewOpen]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const maybeSnapNearestServiceCard = () => {
            if (window.innerWidth >= 768 || isPreviewOpen || sectionSnapStateRef.current.isProgrammaticScroll) {
                return;
            }

            const section = sectionRef.current;
            const header = headerRef.current;
            const cards = cardsRef.current.filter(Boolean);
            if (!section || !header || !cards.length) {
                return;
            }

            const sectionRect = section.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();
            const viewportHeight = getViewportHeight();
            const sectionAtSetPoint = sectionRect.top <= 4;
            const headerIsPinned = headerRect.top <= 0.5;
            const sectionStillActive = sectionRect.bottom > viewportHeight * 0.38;

            if (!sectionAtSetPoint || !headerIsPinned || !sectionStillActive) {
                return;
            }

            const snapLine = ruleRef.current
                ? ruleRef.current.getBoundingClientRect().bottom + 44
                : viewportHeight * 0.56;
            const getCardTitleTop = (card) => {
                const title = card.querySelector('[data-service-title]');
                return title
                    ? title.getBoundingClientRect().top
                    : card.getBoundingClientRect().top;
            };

            let nearestCard = cards[0];
            let nearestDistance = Math.abs(getCardTitleTop(cards[0]) - snapLine);

            cards.forEach(card => {
                const distance = Math.abs(getCardTitleTop(card) - snapLine);
                if (distance < nearestDistance) {
                    nearestCard = card;
                    nearestDistance = distance;
                }
            });

            if (!nearestCard || nearestDistance < 20 || nearestDistance > viewportHeight * 0.42) {
                return;
            }

            const targetTitleTop = getCardTitleTop(nearestCard);
            const targetScrollTop = Math.max(0, window.scrollY + targetTitleTop - snapLine);

            lockSectionSnap(460);
            window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        };

        const handleScroll = () => {
            if (serviceSnapTimeoutRef.current !== null) {
                window.clearTimeout(serviceSnapTimeoutRef.current);
            }

            serviceSnapTimeoutRef.current = window.setTimeout(() => {
                serviceSnapTimeoutRef.current = null;
                maybeSnapNearestServiceCard();
            }, 120);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        const unsubscribeViewportChanges = subscribeViewportChanges(handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribeViewportChanges();

            if (serviceSnapTimeoutRef.current !== null) {
                window.clearTimeout(serviceSnapTimeoutRef.current);
                serviceSnapTimeoutRef.current = null;
            }
        };
    }, [isPreviewOpen]);

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        if (!cards.length) return;

        lastScrollYRef.current = window.scrollY;
        lastServiceChangeScrollYRef.current = window.scrollY;

        const checkActiveCard = () => {
            const viewportHeight = getViewportHeight();
            const mobileTriggerLine = ruleRef.current
                ? Math.max(ruleRef.current.getBoundingClientRect().bottom + 44, viewportHeight * 0.56)
                : viewportHeight * 0.56;
            const triggerLine = window.innerWidth < 768
                ? mobileTriggerLine
                : window.innerHeight * 0.62;
            let nextActiveService = parseInt(cards[0].dataset.service, 10);

            cards.forEach((card) => {
                const cardTop = card.getBoundingClientRect().top;
                const serviceNum = parseInt(card.dataset.service, 10);

                if (cardTop <= triggerLine) {
                    nextActiveService = serviceNum;
                }
            });

            const scrollingDown = window.scrollY >= lastScrollYRef.current;
            lastScrollYRef.current = window.scrollY;

            setActiveService((prev) => {
                if (window.innerWidth >= 768 || prev === nextActiveService) {
                    return nextActiveService;
                }

                const mobileStepTravel = viewportHeight * 0.12;
                const travelSinceLastChange = Math.abs(window.scrollY - lastServiceChangeScrollYRef.current);

                if (travelSinceLastChange < mobileStepTravel) {
                    return prev;
                }

                if (scrollingDown && nextActiveService > prev + 1) {
                    lastServiceChangeScrollYRef.current = window.scrollY;
                    return prev + 1;
                }

                if (!scrollingDown && nextActiveService < prev - 1) {
                    lastServiceChangeScrollYRef.current = window.scrollY;
                    return prev - 1;
                }

                lastServiceChangeScrollYRef.current = window.scrollY;
                return nextActiveService;
            });
        };

        // Check on scroll
        window.addEventListener('scroll', checkActiveCard, { passive: true });
        const unsubscribeViewportChanges = subscribeViewportChanges(checkActiveCard);
        checkActiveCard(); // Initial check

        return () => {
            window.removeEventListener('scroll', checkActiveCard);
            unsubscribeViewportChanges();
        };
    }, []);

    useEffect(() => () => {
        if (previewOpenFrameRef.current !== null) {
            window.cancelAnimationFrame(previewOpenFrameRef.current);
        }

        if (sectionSnapTimeoutRef.current !== null) {
            window.clearTimeout(sectionSnapTimeoutRef.current);
        }

        if (serviceSnapTimeoutRef.current !== null) {
            window.clearTimeout(serviceSnapTimeoutRef.current);
        }

        if (sectionSnapReleaseTimeoutRef.current !== null) {
            window.clearTimeout(sectionSnapReleaseTimeoutRef.current);
        }
    }, []);

    const mobilePhoneSpacerHeight = activeService === lastServiceId
        ? 'max(8dvh, 72px)'
        : '42dvh';
    const mobilePhoneStickyTop = '40dvh';
    const mobilePhoneViewportHeight = 'calc(60dvh + 100px)';
    const handleOpenPhonePreview = () => {
        const section = sectionRef.current;
        if (!section) {
            onOpenPreview?.();
            return;
        }

        if (previewOpenFrameRef.current !== null) {
            window.cancelAnimationFrame(previewOpenFrameRef.current);
            previewOpenFrameRef.current = null;
        }

        const rect = section.getBoundingClientRect();
        if (Math.abs(rect.top) <= 4) {
            onOpenPreview?.();
            return;
        }

        const startTime = Date.now();
        lockSectionSnap(1100);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const waitForSectionAlignment = () => {
            const nextRect = section.getBoundingClientRect();
            const hasAligned = Math.abs(nextRect.top) <= 4;
            const hasTimedOut = Date.now() - startTime > 1150;

            if (hasAligned || hasTimedOut) {
                previewOpenFrameRef.current = null;
                onOpenPreview?.();
                return;
            }

            previewOpenFrameRef.current = window.requestAnimationFrame(waitForSectionAlignment);
        };

        previewOpenFrameRef.current = window.requestAnimationFrame(waitForSectionAlignment);
    };

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative overflow-x-clip bg-[#ffffff] text-gray-900 py-24"
            aria-labelledby="services-heading"
        >
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[8.5rem] md:hidden"
                aria-hidden="true"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 38%, rgba(255,255,255,0.46) 66%, rgba(255,255,255,0.82) 86%, rgba(255,255,255,1) 100%)',
                }}
            />
            <motion.div
                animate={{
                    filter: isPreviewOpen ? 'blur(18px) brightness(0.52)' : 'blur(0px) brightness(1)',
                    scale: isPreviewOpen ? 0.985 : 1,
                }}
                transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'center top' }}
            >
                <div className="mx-auto max-w-[1600px] px-6 md:px-8 lg:px-12">
                    <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-8 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-12 lg:translate-x-10 xl:translate-x-16">
                        <div className="hidden lg:block sticky top-24">
                            <div className="relative flex flex-col items-center">
                                <PhoneMockup
                                    activeService={activeService}
                                    shouldLoadMedia={shouldLoadPhoneMedia}
                                    suspendPlayback={isPreviewOpen}
                                />
                                <PhonePreviewButton
                                    onClick={handleOpenPhonePreview}
                                    className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[6.5rem] -ml-[100px] z-20"
                                />
                            </div>
                        </div>

                        <div className="relative z-0 flex flex-col">
                            <div ref={headerRef} className="sticky top-0 z-30 -mt-24 bg-[#ffffff] pt-24">
                                <h2
                                    id="services-heading"
                                    className="mb-4 font-medium leading-[1.06] tracking-[-0.04em] text-gray-900"
                                    style={{ fontSize: 'clamp(1.25rem, 2.5vw, var(--text-h2))' }}
                                >
                                    <span
                                        className="block transition-[opacity,transform] duration-300 ease-out"
                                        style={getRevealStyle(headerLineOneProgress, 32)}
                                    >
                                        Our services extend the
                                    </span>
                                    <span
                                        className="block transition-[opacity,transform] duration-300 ease-out"
                                        style={getRevealStyle(headerLineTwoProgress, 32)}
                                    >
                                        entire customer journey.
                                    </span>
                                </h2>
                                <div className="relative">
                                    <div
                                        ref={ruleRef}
                                        className="relative z-10 h-px w-full transition-[opacity,transform] duration-300 ease-out"
                                        style={{
                                            ...getRevealStyle(headerRuleProgress, 20),
                                            background: 'linear-gradient(90deg, rgba(156,163,175,0.9) 0%, rgba(156,163,175,0.5) 45%, rgba(156,163,175,0.15) 75%, rgba(156,163,175,0) 100%)',
                                        }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-x-0 top-full h-10"
                                        aria-hidden="true"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 34%, rgba(255,255,255,0.32) 68%, rgba(255,255,255,0) 100%)',
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="services-content">
                                <div className="flex flex-col gap-[20vh] pb-64">
                                    {phoneServices.map((service, index) => (
                                        <ServiceCard
                                            key={service.id}
                                            ref={(el) => (cardsRef.current[index] = el)}
                                            service={service}
                                            index={index}
                                            activeServiceId={activeService}
                                            isActive={activeService === service.id}
                                            isFirst={index === 0}
                                            isLast={index === phoneServices.length - 1}
                                            headerRef={headerRef}
                                            ruleRef={ruleRef}
                                        />
                                    ))}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none transition-[height] duration-300 md:hidden"
                                        style={{ height: mobilePhoneSpacerHeight }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-20 md:hidden">
                    <div
                        className="sticky"
                        style={{
                            top: mobilePhoneStickyTop,
                        }}
                    >
                        <div
                            className="relative overflow-visible rounded-t-[1.9rem] bg-transparent"
                            style={{
                                height: mobilePhoneViewportHeight,
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div className="absolute left-1/2 top-[90px] -translate-x-[20%]" aria-hidden="true">
                                <div
                                    className="w-[25.8rem] max-w-none"
                                    style={{
                                        transform: 'translateZ(0) rotate(16deg) scale(1.1)',
                                        transformOrigin: 'top center',
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    <PhoneMockup
                                        activeService={activeService}
                                        shouldLoadMedia={shouldLoadPhoneMedia}
                                        suspendPlayback={isPreviewOpen}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-auto absolute bottom-[114px] right-4 z-30">
                                <PhonePreviewButton onClick={handleOpenPhonePreview} compact />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <MediaLightbox
                isOpen={isPreviewOpen}
                slides={phonePreviewSlides}
                initialIndex={Math.max(0, activeService - 1)}
                onClose={onClosePreview}
                title="Phone Preview"
                showTitle={false}
                closeLabel="Close phone preview gallery"
                zIndexClassName="z-50"
                bounds={previewBounds}
                lockScroll={false}
                trapScroll
            />
        </section>
    );
}

// Gradient backgrounds for each service screen
const serviceScreenStyles = [
    { image: phoneSlideImages[0] ?? null },
    { video: phoneSlideVideos[0] ?? null },
    { video: phoneSlideVideos[1] ?? null },
    { image: phoneSlideImages[1] ?? null, fitWidthTop: true },
];

const phoneServiceUtilityCards = {
    1: {
        primary: ['Architectural Renders', 'Concept Visualization', 'High-Resolution Output', 'Product Breakdowns', 'Multi-Angle Views'],
        programs: [
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Redshift', tint: 'bg-[#7c2d12] text-white' },
            { label: 'SketchUp', tint: 'bg-[#b45309] text-[#fde68a]' },
            { label: 'Three', tint: 'bg-[#0f172a] text-[#e2e8f0]' },
        ],
    },
    2: {
        primary: ['Hero reels', 'Social loops', 'Micro-interactions', 'UI motion', 'UX flows'],
        programs: [
            { label: 'AE', tint: 'bg-[#312e81] text-[#c4b5fd]' },
            { label: 'PR', tint: 'bg-[#3b0764] text-[#f0abfc]' },
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Rive', tint: 'bg-[#0f172a] text-[#93c5fd]' },
        ],
    },
    3: {
        primary: ['Material Previews', 'Packaging Mockups', 'SKU Variations', 'Label Swaps', 'Finish Options'],
        programs: [
            { label: 'PS', tint: 'bg-[#172554] text-[#93c5fd]' },
            { label: 'Ai', tint: 'bg-[#431407] text-[#fdba74]' },
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Esko', tint: 'bg-[#111827] text-[#d1d5db]' },
        ],
    },
    4: {
        primary: ['Interactive Product Pages', '3D Viewers', 'Product Customizers', 'Custom Storefronts', 'Fast, Clean Builds'],
        programs: [
            { label: 'Figma', tint: 'bg-[#111827] text-white' },
            { label: 'React', tint: 'bg-[#083344] text-[#67e8f9]' },
            { label: 'Shopify', tint: 'bg-[#14532d] text-[#86efac]' },
            { label: 'Three', tint: 'bg-[#0f172a] text-[#e2e8f0]' },
        ],
    },
};

const programBrandMap = {
    c4d: { name: 'Cinema 4D', monogram: 'C4D', accent: '#011A6A', surface: '#EEF4FF' },
    redshift: { name: 'Redshift', monogram: 'RS', accent: '#E05A1B', surface: '#FFF4ED' },
    ps: { name: 'Photoshop', monogram: 'Ps', accent: '#31A8FF', surface: '#EAF5FF' },
    ai: { name: 'Illustrator', monogram: 'Ai', accent: '#FF9A00', surface: '#FFF3E0' },
    ae: { name: 'After Effects', monogram: 'Ae', accent: '#9999FF', surface: '#F2EEFF' },
    pr: { name: 'Premiere Pro', monogram: 'Pr', accent: '#EA77FF', surface: '#FAEEFF' },
    rive: { name: 'Rive', monogram: 'Rv', accent: '#38BDF8', surface: '#ECFEFF' },
    sketchup: { name: 'SketchUp', monogram: 'Sk', accent: '#005F9E', surface: '#EDF6FF' },
    esko: { name: 'Esko', monogram: 'Es', accent: '#A3B18A', surface: '#F5F8ED' },
    figma: { name: 'Figma', monogram: 'Fg', accent: '#F24E1E', surface: '#FFF1EE' },
    react: { name: 'React', monogram: 'Re', accent: '#0891B2', surface: '#ECFEFF' },
    shopify: { name: 'Shopify', monogram: 'Sh', accent: '#5D8C42', surface: '#F1F8EC' },
    three: { name: 'Three.js', monogram: '3D', accent: '#111111', surface: '#F3F4F6' },
};

const getProgramBrand = (label) => programBrandMap[label.trim().toLowerCase()] ?? {
    name: label,
    monogram: label.slice(0, 2),
    accent: '#111827',
    surface: '#F3F4F6',
};

function ProgramMark({ label }) {
    const brand = getProgramBrand(label);

    return (
        <span
            className="inline-flex items-center gap-2.5 text-[11px] font-normal tracking-[-0.01em] text-gray-500"
            title={brand.name}
        >
            <span
                className="flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: brand.surface ?? '#FFFFFF' }}
                aria-hidden="true"
            >
                <span
                    className="font-semibold tracking-[-0.04em]"
                    style={{ color: brand.accent, fontSize: '10px' }}
                >
                    {brand.monogram}
                </span>
            </span>
            <span className="whitespace-nowrap font-light">{brand.name}</span>
        </span>
    );
}

function PhoneMockup({ activeService, shouldLoadMedia = false, suspendPlayback = false, className = '' }) {
    // Screen area within phone.png (1349×2048), measured via pixel scan:
    // left=18px (1.33%), right margin=521px (38.62%), top=26px (1.27%), bottom margin=372px (18.16%)
    // Screen dimensions: 810×1650px within 1349×2048 image
    return (
        <div
            className={className ? `relative ${className}` : 'relative'}
            style={className ? { aspectRatio: '523 / 794' } : { width: '523px', height: '794px' }}
        >
            {/* Layer 1 (bottom): Phone body image */}
            <img
                src="/phone.png"
                alt="Phone body"
                loading="lazy"
                decoding="async"
                className="relative z-0 h-full w-full rounded-[60px]"
            />

            {/* Layer 2 (middle): Screen content - 287x621 gradient */}
            <div
                className="absolute overflow-hidden z-10"
                style={{
                    width: '54.88%',
                    height: '78.21%',
                    top: '2.52%',
                    left: '4.02%',
                    borderRadius: 'clamp(1.5rem, 7vw, 2.5rem)',
                }}
            >
                {phoneServices.map((service, index) => (
                    <PhoneScreen
                        key={service.id}
                        service={service}
                        screenStyle={serviceScreenStyles[index]}
                        isActive={activeService === service.id}
                        shouldPrime={Math.abs(activeService - service.id) <= 1}
                        shouldLoadMedia={shouldLoadMedia}
                        suspendPlayback={suspendPlayback}
                    />
                ))}
            </div>

            {/* Layer 3 (top): Widget PNG - Dynamic Island at top-center of screen */}
            <img
                src="/widget.png"
                alt="Dynamic Island"
                loading="lazy"
                decoding="async"
                className="absolute z-20 pointer-events-none"
                style={{
                    width: '19.69%',
                    height: '76.45%',
                    top: '3.4%',
                    left: '21.61%',
                }}
            />
        </div>
    );
}

function PhoneScreen({ service, screenStyle, isActive, shouldPrime, shouldLoadMedia, suspendPlayback }) {
    const hasImageBackground = Boolean(screenStyle.image);
    const hasVideoBackground = Boolean(screenStyle.video);
    const hasMediaBackground = hasImageBackground || hasVideoBackground;
    const fitWidthTop = Boolean(screenStyle.fitWidthTop);
    const videoRef = useRef(null);
    const [hasAttachedMedia, setHasAttachedMedia] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        if (shouldLoadMedia && shouldPrime) {
            setHasAttachedMedia(true);
        }
    }, [shouldLoadMedia, shouldPrime]);

    useEffect(() => {
        if (!hasVideoBackground) {
            return;
        }

        if (!hasAttachedMedia) {
            setIsVideoReady(false);
            return;
        }

        const video = videoRef.current;
        if (!video) {
            return;
        }

        setIsVideoReady(video.readyState >= 2);
    }, [hasAttachedMedia, hasVideoBackground]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !hasVideoBackground || !hasAttachedMedia) {
            return;
        }

        if (isActive && !suspendPlayback) {
            const playPromise = video.play();
            if (playPromise?.catch) {
                playPromise.catch(() => {});
            }
            return;
        }

        video.pause();
    }, [hasAttachedMedia, hasVideoBackground, isActive, suspendPlayback]);

    return (
        <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
            style={hasMediaBackground ? { backgroundColor: hasVideoBackground ? '#000000' : undefined } : screenStyle}
        >
            {hasImageBackground && (
                <img
                    src={hasAttachedMedia ? screenStyle.image : undefined}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={fitWidthTop
                        ? 'absolute left-0 top-0 w-full h-auto'
                        : 'absolute inset-0 h-full w-full object-cover object-center'}
                />
            )}
            {hasVideoBackground && (
                <>
                    <div
                        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}
                        aria-hidden="true"
                    />
                    <video
                        ref={videoRef}
                        src={hasAttachedMedia ? screenStyle.video : undefined}
                        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
                        muted
                        loop
                        playsInline
                        preload={hasAttachedMedia ? 'auto' : 'none'}
                        onLoadedData={() => setIsVideoReady(true)}
                    />
                </>
            )}
            {/* Decorative content inside the phone screen */}
            {!hasMediaBackground && (
                <div className="relative z-10 flex flex-col items-center gap-3 px-6">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-semibold">
                        {service.displayLabel}
                    </div>
                    <div className="text-[44px] font-extrabold text-white leading-none drop-shadow-lg">
                        {service.stat}
                    </div>
                    <div className="text-[11px] text-white/60 font-medium">
                        {service.statLabel}
                    </div>
                    {/* Decorative bar */}
                    <div className="w-24 h-[3px] bg-white/30 rounded-full mt-2">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-700"
                            style={{ width: isActive ? '100%' : '0%' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function WidgetCard({ service, screenStyle }) {
    return (
        <div
            className="bg-white rounded-2xl shadow-xl p-4 w-[140px] border border-gray-100"
            style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
            }}
        >
            <div className="text-[8px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">
                {service.displayLabel}
            </div>
            <div className="text-[22px] font-extrabold text-gray-900 leading-none mb-1">
                {service.stat}
            </div>
            <div className="text-[9px] text-gray-500 mb-3">{service.statLabel}</div>
            {/* Mini progress bar */}
            <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: '75%', ...screenStyle }}
                />
            </div>
        </div>
    );
}

const ServiceCard = React.forwardRef(({ service, activeServiceId, isActive, isFirst, isLast, headerRef, ruleRef }, ref) => {
    const [opacity, setOpacity] = React.useState(() => (
        typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0.24
    ));
    const cardRef = React.useRef(null);
    const revealProgress = useMobileRevealProgress(cardRef, { start: 0.62, end: 0.34 });
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;

    React.useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const inactiveOpacity = 0.34;
        const upcomingHiddenOpacity = 0.16;
        const fadeEndZone = 420;
        const minimumPassedOpacity = 0.22;
        const fadeTriggerOffset = 10;
        const fadeStartDelay = 120;

        const updateOpacity = () => {
            if (window.innerWidth < 768) {
                setOpacity(1);
                return;
            }

            const viewportHeight = getViewportHeight();
            const revealStart = viewportHeight * 0.9;
            const revealEnd = viewportHeight * 0.74;
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top;
            const isPastActive = service.id < activeServiceId;
            const headerStuck = headerRef?.current
                ? headerRef.current.getBoundingClientRect().top <= 0.5
                : false;
            const linePosition = ruleRef?.current
                ? ruleRef.current.getBoundingClientRect().bottom + fadeTriggerOffset - fadeStartDelay
                : 208;
            const distanceFromLine = cardTop - linePosition;

            if (headerStuck && distanceFromLine <= 0) {
                const fadeProgress = Math.min(1, Math.abs(distanceFromLine) / fadeEndZone);
                const startingOpacity = isActive || isPastActive ? 1 : inactiveOpacity;
                const nextOpacity = startingOpacity - fadeProgress * (startingOpacity - minimumPassedOpacity);

                setOpacity(Math.max(minimumPassedOpacity, nextOpacity));
                return;
            }

            if (isPastActive) {
                setOpacity(1);
                return;
            }

            if (!isActive) {
                const revealProgress = Math.max(0, Math.min(1, (revealStart - cardTop) / (revealStart - revealEnd)));
                const nextOpacity = upcomingHiddenOpacity + revealProgress * (inactiveOpacity - upcomingHiddenOpacity);

                setOpacity(nextOpacity);
                return;
            }

            setOpacity(isActive ? 1 : inactiveOpacity);
        };

        window.addEventListener('scroll', updateOpacity, { passive: true });
        const unsubscribeViewportChanges = subscribeViewportChanges(updateOpacity);
        updateOpacity(); // Initial check

        return () => {
            window.removeEventListener('scroll', updateOpacity);
            unsubscribeViewportChanges();
        };
    }, [activeServiceId, headerRef, isActive, ruleRef, service.id]);

    return (
        <div
            ref={(el) => {
                cardRef.current = el;
                if (typeof ref === 'function') {
                    ref(el);
                } else if (ref) {
                    ref.current = el;
                }
            }}
            data-service={service.id}
            className={`service-card transition-opacity duration-300 ease-out ${isFirst ? 'pt-8 md:pt-12' : ''} ${isLast ? 'pb-12' : ''}`}
            style={{
                opacity: opacity,
                transform: isMobileViewport || isActive ? 'translateY(0)' : 'translateY(5px)',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'normal',
            }}
        >
            <CardContent service={service} revealProgress={revealProgress} />
        </div>
    );
});

ServiceCard.displayName = 'ServiceCard';

function CardContent({ service, revealProgress }) {
    const utilityCard = phoneServiceUtilityCards[service.id];
    const titleProgress = getStaggeredProgress(revealProgress, 0);
    const descriptionProgress = getStaggeredProgress(revealProgress, 0.16);
    const utilityProgress = getStaggeredProgress(revealProgress, 0.32);
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    const getCardRevealStyle = (progress, distance) => (
        isMobileViewport
            ? { opacity: progress }
            : getRevealStyle(progress, distance)
    );

    return (
        <>
            <h3
                id={service.anchorId}
                data-service-title
                className="mb-4 scroll-mt-28 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 transition-opacity duration-200 ease-out md:scroll-mt-[15rem] md:transition-[opacity,transform] md:duration-300"
                style={{ ...getCardRevealStyle(titleProgress, 28), fontSize: 'var(--text-h4)' }}
            >
                {service.title}
            </h3>
            <p
                className="mb-6 max-w-[500px] leading-[1.8] text-gray-500 transition-opacity duration-200 ease-out md:transition-[opacity,transform] md:duration-300"
                style={{ ...getCardRevealStyle(descriptionProgress, 22), fontSize: 'var(--text-sm)' }}
            >
                {service.description}
            </p>
            {utilityCard && (
                <div
                    className="hidden max-w-[560px] rounded-[1.35rem] border border-gray-200 bg-[#f4f4f1] p-5 transition-[opacity,transform] duration-300 ease-out md:block"
                    style={getRevealStyle(utilityProgress, 18)}
                >
                    <div className="flex flex-wrap gap-2">
                        {utilityCard.primary.map((keyword) => (
                            <span
                                key={keyword}
                                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-800"
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
                        {utilityCard.programs.map((program) => (
                            <ProgramMark key={program.label} label={program.label} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
