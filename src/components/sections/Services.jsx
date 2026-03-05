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

    const [activeNavItem, setActiveNavItem] = useState('Our Services');

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative bg-[#fafafa] text-gray-900 py-24"
            aria-labelledby="services-heading"
        >
            <div className="max-w-[1600px] ml-0 px-6 md:px-8 lg:pl-12">
                <div className="grid grid-cols-1 lg:grid-cols-[200px_0.35fr_0.65fr] gap-8 lg:gap-16 items-start">
                    {/* Left Sidebar Navigation - Far Left */}
                    <div className="hidden lg:block sticky top-24 -ml-8 pl-8">
                        <nav className="flex flex-col gap-2" aria-label="Services navigation">
                            <a
                                href="#reputation"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveNavItem('Our Reputation');
                                }}
                                className={`font-medium transition-colors leading-tight ${activeNavItem === 'Our Reputation' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                Our Reputation
                            </a>
                            <a
                                href="#services"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveNavItem('Our Services');
                                }}
                                className={`font-medium transition-colors leading-tight ${activeNavItem === 'Our Services' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                Our Services
                            </a>
                            <a
                                href="#model"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveNavItem('Our Model');
                                }}
                                className={`font-medium transition-colors leading-tight ${activeNavItem === 'Our Model' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                Our Model
                            </a>
                        </nav>
                    </div>

                    {/* Phone Mockup */}
                    <div className="hidden lg:block sticky top-24">
                        <PhoneMockup activeService={activeService} />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col">
                        {/* Sticky Header */}
                        <div className="sticky top-24 z-10 bg-[#fafafa]">
                            <h2 id="services-heading" className="font-bold leading-[1.1] mb-2 text-gray-900" style={{ fontSize: 'clamp(1.25rem, 2.5vw, var(--text-h2))' }}>
                                Our services extend the<br />entire customer journey.
                            </h2>
                            <div className="w-full">
                                <svg
                                    viewBox="0 0 584 10"
                                    preserveAspectRatio="none"
                                    className="w-full h-[10px]"
                                    style={{ opacity: 0.4 }}
                                >
                                    {/* Small circle at left */}
                                    <circle
                                        cx="5"
                                        cy="5"
                                        r="4"
                                        fill="currentColor"
                                    />
                                    {/* Horizontal line */}
                                    <line
                                        x1="9"
                                        y1="5"
                                        x2="584"
                                        y2="5"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </svg>
                            </div>
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
    const [opacity, setOpacity] = React.useState(0.15);
    const cardRef = React.useRef(null);

    React.useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // Calculate line position: header top (96px) + heading height + margin bottom
        // The line is right after the heading with mb-8
        const headerTop = 96; // top-24 = 96px (sticky header position)
        const headingHeight = 80; // Approximate heading height
        const headingMarginBottom = 32; // mb-8 = 32px
        const linePosition = headerTop + headingHeight + headingMarginBottom;
        const fadeStartZone = 200; // Start fading before reaching the line (more gradual)
        const fadeEndZone = 150; // Complete fade zone after line

        const updateOpacity = () => {
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top;

            // Calculate distance from line
            const distanceFromLine = cardTop - linePosition;

            // If card is approaching or past the line, start gradual fade
            if (distanceFromLine <= fadeStartZone) {
                if (distanceFromLine <= -fadeEndZone) {
                    // Card is well past the line - completely faded
                    setOpacity(0);
                } else if (distanceFromLine <= 0) {
                    // Card is at or past the line - fade out gradually
                    const fadeProgress = Math.abs(distanceFromLine) / fadeEndZone;
                    setOpacity(Math.max(0, 1 - fadeProgress));
                } else {
                    // Card is approaching the line - start subtle fade
                    const fadeProgress = 1 - (distanceFromLine / fadeStartZone);
                    const baseOpacity = isActive ? 1 : 0.15;
                    setOpacity(Math.max(0.15, baseOpacity * (1 - fadeProgress * 0.3)));
                }
            } else if (isActive) {
                // Active card well below line is fully visible
                setOpacity(1);
            } else {
                // Inactive card well below line is dimmed (shadow effect)
                setOpacity(0.15);
            }
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
            <h3 className="font-bold mb-4 text-gray-900 leading-tight" style={{ fontSize: 'var(--text-h4)' }}>
                {service.title}
            </h3>
            <p className="leading-relaxed text-gray-600 max-w-[480px] mb-6" style={{ fontSize: 'var(--text-sm)' }}>
                {service.description}
            </p>
            <div className="flex items-center gap-6 mb-8">
                <span className="text-gray-600" style={{ fontSize: 'var(--text-sm)' }}>
                    Starts at <strong className="text-gray-900 font-semibold">{service.price}</strong>
                </span>
                <div className="h-4 w-px bg-gray-300" aria-hidden="true" />
                <a href="#" className="font-medium px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-900" style={{ fontSize: 'var(--text-xs)' }}>
                    Learn More
                </a>
            </div>
            {service.testimonial && (
                <div className="bg-gray-200 rounded-xl p-5 max-w-[480px] border border-gray-300">
                    <div className="flex gap-3 mb-3">
                        <span className="text-gray-900 leading-none font-black" style={{ fontSize: 'var(--text-h5)' }}>"</span>
                        <p className="font-semibold text-gray-900 leading-snug" style={{ fontSize: 'var(--text-sm)' }}>{service.testimonial.quote}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-300">
                        <img
                            src={`https://i.pravatar.cc/80?u=${service.id}`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                            <div className="font-semibold text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>{service.testimonial.author}</div>
                            <div className="text-gray-600" style={{ fontSize: 'var(--text-xs)' }}>{service.testimonial.title}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
