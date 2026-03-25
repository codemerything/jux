import React, { useRef, useEffect, useState } from 'react';
import { phoneServices } from '../../data/services';

const phoneSlideImages = Object.entries(
    import.meta.glob('../../../heroImages/phoneslides/*.{jpg,jpeg,png,webp,avif}', {
        eager: true,
        import: 'default',
    })
)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([, src]) => src);

const phoneSlideVideos = Object.entries(
    import.meta.glob('../../../heroImages/phoneslides/*.{mp4,webm,mov}', {
        eager: true,
        import: 'default',
    })
)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([, src]) => src);

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

export default function Services() {
    const [activeService, setActiveService] = useState(1);
    const cardsRef = useRef([]);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const ruleRef = useRef(null);
    const lastScrollYRef = useRef(0);
    const lastServiceChangeScrollYRef = useRef(0);
    const lastServiceId = phoneServices[phoneServices.length - 1]?.id ?? 1;

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        if (!cards.length) return;

        lastScrollYRef.current = window.scrollY;
        lastServiceChangeScrollYRef.current = window.scrollY;

        const checkActiveCard = () => {
            const viewportHeight = getViewportHeight();
            const mobileTriggerLine = ruleRef.current
                ? ruleRef.current.getBoundingClientRect().bottom + 44
                : viewportHeight * 0.42;
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

                const mobileStepTravel = viewportHeight * 0.18;
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

    const mobilePhoneSpacerHeight = activeService === lastServiceId
        ? 'max(8dvh, 72px)'
        : '42dvh';
    const mobilePhoneStickyTop = '40dvh';
    const mobilePhoneViewportHeight = '60dvh';

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative overflow-x-clip bg-[#ffffff] text-gray-900 py-24"
            aria-labelledby="services-heading"
        >
            <div className="mx-auto max-w-[1600px] px-6 md:px-8 lg:px-12">
                <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-8 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-12 lg:translate-x-10 xl:translate-x-16">
                    {/* Phone Mockup */}
                    <div className="hidden lg:block sticky top-24">
                        <PhoneMockup activeService={activeService} />
                    </div>

                    {/* Content Column */}
                    <div className="relative z-0 flex flex-col">
                        {/* Sticky Header */}
                        <div ref={headerRef} className="sticky top-0 z-30 -mt-24 bg-[#ffffff] pt-24">
                            <h2
                                id="services-heading"
                                className="mb-4 font-medium leading-[1.06] tracking-[-0.04em] text-gray-900"
                                style={{ fontSize: 'clamp(1.25rem, 2.5vw, var(--text-h2))' }}
                            >
                                Our services extend the<br />entire customer journey.
                            </h2>
                            <div
                                ref={ruleRef}
                                className="mb-6 h-px w-full"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(156,163,175,0.9) 0%, rgba(156,163,175,0.5) 45%, rgba(156,163,175,0.15) 75%, rgba(156,163,175,0) 100%)',
                                }}
                            />
                        </div>

                        <div className="services-content">
                            {/* Cards List - Normal Document Flow */}
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
            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-20 md:hidden" aria-hidden="true">
                <div
                    className="sticky"
                    style={{
                        top: mobilePhoneStickyTop,
                    }}
                >
                    <div
                        className="relative overflow-hidden rounded-t-[1.9rem] bg-[#fff]"
                        style={{
                            height: mobilePhoneViewportHeight,
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        <div className="absolute left-1/2 top-[90px] -translate-x-[20%]">
                            <div
                                className="w-[25.8rem] max-w-none"
                                style={{
                                    transform: 'translateZ(0) rotate(16deg) scale(1.1)',
                                    transformOrigin: 'top center',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <PhoneMockup activeService={activeService} className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        primary: ['Single SKU', 'Multi-SKU', 'Multi-angle'],
        programs: [
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Redshift', tint: 'bg-[#7c2d12] text-white' },
            { label: 'PS', tint: 'bg-[#172554] text-[#93c5fd]' },
            { label: 'Ai', tint: 'bg-[#431407] text-[#fdba74]' },
        ],
    },
    2: {
        primary: ['Hero reels', 'Social loops', 'Paid media'],
        programs: [
            { label: 'AE', tint: 'bg-[#312e81] text-[#c4b5fd]' },
            { label: 'PR', tint: 'bg-[#3b0764] text-[#f0abfc]' },
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Spline', tint: 'bg-[#0f172a] text-[#93c5fd]' },
        ],
    },
    3: {
        primary: ['Colorways', 'Bundle sets', 'Multi-pack'],
        programs: [
            { label: 'PS', tint: 'bg-[#172554] text-[#93c5fd]' },
            { label: 'Ai', tint: 'bg-[#431407] text-[#fdba74]' },
            { label: 'C4D', tint: 'bg-[#1f2937] text-white' },
            { label: 'Bridge', tint: 'bg-[#111827] text-[#d1d5db]' },
        ],
    },
    4: {
        primary: ['AR / VR', '3D viewer', 'Configurator'],
        programs: [
            { label: 'Figma', tint: 'bg-[#111827] text-white' },
            { label: 'React', tint: 'bg-[#083344] text-[#67e8f9]' },
            { label: 'Shopify', tint: 'bg-[#14532d] text-[#86efac]' },
            { label: 'Three', tint: 'bg-[#0f172a] text-[#e2e8f0]' },
        ],
    },
};

function PhoneMockup({ activeService, className = '' }) {
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
                className="relative z-0 h-full w-full"
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
                    />
                ))}
            </div>

            {/* Layer 3 (top): Widget PNG - Dynamic Island at top-center of screen */}
            <img
                src="/widget.png"
                alt="Dynamic Island"
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

function PhoneScreen({ service, screenStyle, isActive }) {
    const hasImageBackground = Boolean(screenStyle.image);
    const hasVideoBackground = Boolean(screenStyle.video);
    const hasMediaBackground = hasImageBackground || hasVideoBackground;
    const fitWidthTop = Boolean(screenStyle.fitWidthTop);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !hasVideoBackground) {
            return;
        }

        if (isActive) {
            const playPromise = video.play();
            if (playPromise?.catch) {
                playPromise.catch(() => {});
            }
            return;
        }

        video.pause();
    }, [hasVideoBackground, isActive]);

    return (
        <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
            style={hasMediaBackground ? undefined : screenStyle}
        >
            {hasImageBackground && (
                <img
                    src={screenStyle.image}
                    alt=""
                    className={fitWidthTop
                        ? 'absolute left-0 top-0 w-full h-auto'
                        : 'absolute inset-0 h-full w-full object-cover object-center'}
                />
            )}
            {hasVideoBackground && (
                <video
                    ref={videoRef}
                    src={screenStyle.video}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
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
            className={`service-card transition-opacity duration-300 ease-out ${isFirst ? 'pt-12' : ''} ${isLast ? 'pb-12' : ''}`}
            style={{
                opacity: opacity,
                transform: isActive ? 'translateY(0)' : 'translateY(5px)',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'normal',
            }}
        >
            <CardContent service={service} />
        </div>
    );
});

ServiceCard.displayName = 'ServiceCard';

function CardContent({ service }) {
    const utilityCard = phoneServiceUtilityCards[service.id];

    return (
        <>
            <h3
                className="mb-4 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900"
                style={{ fontSize: 'var(--text-h4)' }}
            >
                {service.title}
            </h3>
            <p
                className="mb-6 max-w-[500px] leading-[1.8] text-gray-500"
                style={{ fontSize: 'var(--text-sm)' }}
            >
                {service.description}
            </p>
            {utilityCard && (
                <div className="hidden max-w-[480px] rounded-[1.35rem] border border-gray-200 bg-[#f4f4f1] p-5 md:block">
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
                            <span
                                key={program.label}
                                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${program.tint}`}
                                style={{ fontSize: '11px' }}
                            >
                                {program.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
