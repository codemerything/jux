import React, { useRef, useEffect, useState } from 'react';
import { phoneServices } from '../../data/services';

export default function Services() {
    const [activeService, setActiveService] = useState(1);
    const cardsRef = useRef([]);
    const sectionRef = useRef(null);

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        if (!cards.length) return;

        const focalPoint = window.innerHeight * 0.45; // Match center of sticky phone

        const checkActiveCard = () => {
            let activeCard = null;
            let minDistance = Infinity;

            cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardTrigger = rect.top;
                const distance = Math.abs(cardTrigger - focalPoint);

                if (distance < minDistance) {
                    minDistance = distance;
                    activeCard = card;
                }
            });

            if (activeCard) {
                const serviceNum = parseInt(activeCard.dataset.service);
                setActiveService((prev) => (prev !== serviceNum ? serviceNum : prev));
            }
        };

        // Check on scroll
        window.addEventListener('scroll', checkActiveCard, { passive: true });
        checkActiveCard(); // Initial check

        return () => {
            window.removeEventListener('scroll', checkActiveCard);
        };
    }, []);

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative bg-[#ffffff] text-gray-900 py-24"
            aria-labelledby="services-heading"
        >
            <div className="mx-auto max-w-[1600px] px-6 md:px-8 lg:px-12">
                <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-8 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-12 lg:translate-x-10 xl:translate-x-16">
                    {/* Phone Mockup */}
                    <div className="hidden lg:block sticky top-24">
                        <PhoneMockup activeService={activeService} />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-10 -mt-24 bg-[#ffffff] pt-24">
                            <h2
                                id="services-heading"
                                className="mb-4 font-medium leading-[1.06] tracking-[-0.04em] text-gray-900"
                                style={{ fontSize: 'clamp(1.25rem, 2.5vw, var(--text-h2))' }}
                            >
                                Our services extend the<br />entire customer journey.
                            </h2>
                            <div
                                className="mb-6 h-px w-full"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(156,163,175,0.9) 0%, rgba(156,163,175,0.5) 45%, rgba(156,163,175,0.15) 75%, rgba(156,163,175,0) 100%)',
                                }}
                            />
                        </div>

                        <div className="services-content">
                            {/* Cards List - Normal Document Flow */}
                            <div className="flex flex-col gap-[15vh] pb-20">
                                {phoneServices.map((service, index) => (
                                    <ServiceCard
                                        key={service.id}
                                        ref={(el) => (cardsRef.current[index] = el)}
                                        service={service}
                                        index={index}
                                        isActive={activeService === service.id}
                                        isFirst={index === 0}
                                    />
                                ))}
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
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
];

function PhoneMockup({ activeService }) {
    // Screen area within phone.png (1349×2048), measured via pixel scan:
    // left=18px (1.33%), right margin=521px (38.62%), top=26px (1.27%), bottom margin=372px (18.16%)
    // Screen dimensions: 810×1650px within 1349×2048 image
    return (
        <div className="relative" style={{ width: '523px', height: '794px' }}>
            {/* Layer 1 (bottom): Phone body image */}
            <img
                src="/phone.png"
                alt="Phone body"
                className="relative z-0 w-full h-auto"
            />

            {/* Layer 2 (middle): Screen content - 287x621 gradient */}
            <div
                className="absolute overflow-hidden z-10"
                style={{
                    width: '287px',
                    height: '621px',
                    top: '20px',
                    left: '21px',
                    borderRadius: '40px',
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
                    width: '103px',
                    height: '607px',
                    top: '27px',
                    left: '113px',
                }}
            />
        </div>
    );
}

function PhoneScreen({ service, screenStyle, isActive }) {
    return (
        <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
            style={screenStyle}
        >
            {/* Decorative content inside the phone screen */}
            <div className="flex flex-col items-center gap-3 px-6">
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

const ServiceCard = React.forwardRef(({ service, isActive, isFirst }, ref) => {
    const [opacity, setOpacity] = React.useState(0.24);
    const cardRef = React.useRef(null);

    React.useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const headerTop = 96; // top-24 = 96px (sticky header position)
        const headingHeight = 80; // Approximate heading height
        const headingMarginBottom = 32; // mb-8 = 32px
        const linePosition = headerTop + headingHeight + headingMarginBottom;
        const inactiveOpacity = 0.24;
        const passedLineStartingOpacity = 0.82;
        const fadeEndZone = 260;
        const minimumPassedOpacity = 0.08;

        const updateOpacity = () => {
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top;
            const distanceFromLine = cardTop - linePosition;

            if (distanceFromLine <= 0) {
                const fadeProgress = Math.min(1, Math.abs(distanceFromLine) / fadeEndZone);
                const startingOpacity = isActive ? 1 : passedLineStartingOpacity;
                const nextOpacity = startingOpacity - fadeProgress * (startingOpacity - minimumPassedOpacity);

                setOpacity(Math.max(minimumPassedOpacity, nextOpacity));
                return;
            }

            setOpacity(isActive ? 1 : inactiveOpacity);
        };

        window.addEventListener('scroll', updateOpacity, { passive: true });
        updateOpacity(); // Initial check

        return () => {
            window.removeEventListener('scroll', updateOpacity);
        };
    }, [isActive]);

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
            className={`service-card transition-opacity duration-300 ease-out ${isFirst ? 'pt-12' : ''}`}
            style={{
                opacity: opacity,
                transform: isActive ? 'translateY(0)' : 'translateY(5px)',
            }}
        >
            <CardContent service={service} />
        </div>
    );
});

ServiceCard.displayName = 'ServiceCard';

function CardContent({ service }) {
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
            <div className="flex items-center gap-6 mb-8">
                <span className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>
                    Starts at <strong className="font-medium text-gray-900">{service.price}</strong>
                </span>
                <div className="h-4 w-px bg-gray-300" aria-hidden="true" />
                <a
                    href="#"
                    className="rounded-full border border-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
                    style={{ fontSize: 'var(--text-xs)' }}
                >
                    Learn More
                </a>
            </div>
            {service.testimonial && (
                <div className="max-w-[480px] rounded-[1.35rem] border border-gray-200 bg-[#f4f4f1] p-5">
                    <div className="flex gap-3 mb-3">
                        <span className="leading-none font-medium text-gray-500" style={{ fontSize: 'var(--text-h5)' }}>"</span>
                        <p
                            className="font-medium leading-[1.65] tracking-[-0.01em] text-gray-800"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            {service.testimonial.quote}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-3">
                        <img
                            src={`https://i.pravatar.cc/80?u=${service.id}`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                            <div className="font-medium tracking-[-0.01em] text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>
                                {service.testimonial.author}
                            </div>
                            <div className="text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                                {service.testimonial.title}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
