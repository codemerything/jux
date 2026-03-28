import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { laptopServices } from '../../data/services';
import UnicornScene from '../ui/UnicornScene';

const laptopWideSlides = Object.fromEntries(
    Object.entries(
    import.meta.glob('../../../heroImages/wideslides/*.{png,jpg,jpeg,webp,avif,mp4,webm,mov}', {
        eager: true,
        import: 'default',
    })
)
        .map(([path, src]) => {
            const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? path;
            return [fileName, src];
        })
);

const laptopServiceCallouts = {
    1: {
        title: 'Stop breaking the stack every time content changes.',
        detail: 'We build the publishing and asset flow so launches, updates, and experiments stop creating technical debt.',
    },
    2: {
        title: 'You know the work is off, but not why yet.',
        detail: 'This is the strategy pass that turns scattered feedback into a clear visual direction, system, and execution plan.',
    },
    3: {
        title: 'Let customers interact before they commit.',
        detail: 'Use 3D, configurators, and guided product views to answer questions earlier and raise buying confidence.',
    },
    4: {
        title: 'Make every brand touchpoint feel like the same company.',
        detail: 'We turn visual decisions into a repeatable system so site, campaigns, decks, and launches stay aligned.',
    },
};

const mobilePreviewSlides = {
    1: {
        key: 'wideslide1',
        position: 'top',
    },
    2: {
        key: 'wideslide2',
        position: 'center',
    },
    4: {
        key: 'wideslide4',
        position: 'top',
    },
};

function MobilePreviewBadge({ expanded = false }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/90 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-sky-700 lg:hidden">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                    d="M1.75 10s3.05-5 8.25-5 8.25 5 8.25 5-3.05 5-8.25 5-8.25-5-8.25-5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="10" cy="10" r="2.35" fill="currentColor" />
            </svg>
            <span>{expanded ? 'Tap to hide' : 'Tap to preview'}</span>
        </div>
    );
}

export default function LaptopServices() {
    const [activeService, setActiveService] = useState(0);
    const [mobilePreviewServiceId, setMobilePreviewServiceId] = useState(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        let frameId = null;

        const syncActiveCard = () => {
            const cards = cardRefs.current.filter(Boolean);
            if (!cards.length) {
                frameId = null;
                return;
            }

            const triggerLine = 96;
            let nextActive = 0;
            let minDistance = Infinity;

            cards.forEach((card, index) => {
                const distance = Math.abs(card.getBoundingClientRect().top - triggerLine);

                if (distance < minDistance) {
                    minDistance = distance;
                    nextActive = index;
                }
            });

            setActiveService(current => (current === nextActive ? current : nextActive));
            frameId = null;
        };

        const requestSync = () => {
            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(syncActiveCard);
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
        const syncMobilePreviewState = () => {
            if (window.innerWidth >= 1024) {
                setMobilePreviewServiceId(null);
            }
        };

        syncMobilePreviewState();
        window.addEventListener('resize', syncMobilePreviewState);

        return () => {
            window.removeEventListener('resize', syncMobilePreviewState);
        };
    }, []);

    const currentService = laptopServices[activeService];
    const slideKey = `laptop-slide-${activeService}`;
    const toggleMobilePreview = serviceId => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            return;
        }

        if (!mobilePreviewSlides[serviceId]) {
            return;
        }

        setMobilePreviewServiceId(current => (current === serviceId ? null : serviceId));
    };

    return (
        <section id="laptop-services" className="relative overflow-visible bg-[#f5f5f0] py-24" aria-labelledby="laptop-services-heading">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[19.2rem] lg:hidden"
                aria-hidden="true"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,248,0.99) 22%, rgba(247,247,243,0.96) 50%, rgba(245,245,240,0.84) 78%, rgba(245,245,240,0) 100%)',
                }}
            />
            <h2 id="laptop-services-heading" className="sr-only">How we work</h2>
            <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] xl:gap-20">

                    {/* Left: Scrolling Content */}
                    <div className="relative z-10 order-2 lg:order-1">
                        <div className="space-y-8 pb-40">
                            {laptopServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    id={service.anchorId}
                                    ref={el => cardRefs.current[index] = el}
                                    onClick={() => toggleMobilePreview(service.id)}
                                    className={`rounded-2xl border transition-all duration-500 ${activeService === index
                                        ? 'bg-white border-gray-200 shadow-lg'
                                        : 'bg-transparent border-gray-100'
                                        } ${mobilePreviewSlides[service.id] ? 'cursor-pointer lg:cursor-default' : ''}`}
                                    style={{ scrollMarginTop: '7rem' }}
                                >
                                    <div className="px-4 pt-8 sm:px-8">
                                        <h3 className="font-bold mb-4 text-gray-900" style={{ fontSize: 'var(--text-h4)' }}>{service.title}</h3>
                                        <p
                                            className={`text-gray-500 leading-relaxed ${mobilePreviewSlides[service.id] ? 'mb-0' : 'mb-4 sm:mb-6'}`}
                                            style={{ fontSize: 'var(--text-sm)' }}
                                        >
                                            {service.description}
                                        </p>
                                    </div>

                                    {mobilePreviewSlides[service.id] ? (
                                        <div className="space-y-0">
                                            <div
                                                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                                                    mobilePreviewServiceId === service.id ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                                                }`}
                                            >
                                                <div className="min-h-0 px-4 pb-8 sm:px-8">
                                                    <div className="flex h-[84px] items-center justify-center">
                                                        <MobilePreviewBadge expanded={mobilePreviewServiceId === service.id} />
                                                    </div>

                                                    {laptopServiceCallouts[service.id] && (
                                                        <div className="border-t border-gray-100 pt-6">
                                                            <p className="mb-2 font-medium leading-[1.32] tracking-[-0.01em] text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>
                                                                {laptopServiceCallouts[service.id].title}
                                                            </p>
                                                            <p className="max-w-[560px] leading-[1.5] text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                                                                {laptopServiceCallouts[service.id].detail}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                                                    mobilePreviewServiceId === service.id && laptopWideSlides[mobilePreviewSlides[service.id].key]
                                                        ? 'mt-2 grid-rows-[1fr] opacity-100'
                                                        : 'mt-0 grid-rows-[0fr] opacity-0'
                                                }`}
                                            >
                                                <div className="min-h-0 px-2 pb-2">
                                                    <div className="overflow-hidden rounded-[12px] border border-gray-200 bg-white">
                                                        <div
                                                            className="aspect-[16/10] bg-white bg-cover bg-top bg-no-repeat"
                                                            style={{
                                                                backgroundImage: `url(${laptopWideSlides[mobilePreviewSlides[service.id].key]})`,
                                                                backgroundPosition: mobilePreviewSlides[service.id].position,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 pb-5 sm:px-8 sm:pb-8">
                                            <div className="mb-6 hidden h-[21px] lg:block" aria-hidden="true" />

                                            {laptopServiceCallouts[service.id] && (
                                                <div className="border-t border-gray-100 pt-5 sm:pt-6">
                                                    <p className="mb-2 font-medium leading-[1.32] tracking-[-0.01em] text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>
                                                        {laptopServiceCallouts[service.id].title}
                                                    </p>
                                                    <p className="max-w-[560px] leading-[1.5] text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                                                        {laptopServiceCallouts[service.id].detail}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Sticky Glass Laptop */}
                    <div className="order-1 z-10 hidden lg:sticky lg:top-24 lg:flex lg:order-2">
                        <div className="relative flex w-full justify-start">
                            <div className="relative w-full max-w-[620px] rounded-[12px] border border-[#d8d5cc] bg-[#ece9e1] p-[5px] shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:max-w-[660px]">
                                <div className="relative aspect-[16/10.8] overflow-hidden rounded-[8px] bg-white xl:aspect-[16/11]">
                                    <div className="absolute inset-0 bg-linear-to-br from-white/18 to-transparent pointer-events-none z-10" />

                                    <div className="relative h-full w-full overflow-hidden bg-white">
                                        <AnimatePresence mode="sync">
                                            <motion.div
                                                key={slideKey}
                                                className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                {activeService === 0 && laptopWideSlides.wideslide1 ? (
                                                    <img
                                                        src={laptopWideSlides.wideslide1}
                                                        alt=""
                                                        className="h-auto w-full self-start"
                                                    />
                                                ) : activeService === 1 && laptopWideSlides.wideslide2 ? (
                                                    <img
                                                        src={laptopWideSlides.wideslide2}
                                                        alt=""
                                                        className="h-full w-auto max-w-none"
                                                    />
                                                ) : activeService === 2 ? (
                                                    <div className="relative h-full w-full overflow-hidden bg-[#002440]">
                                                        <UnicornScene
                                                            filePath="/unicorn/laptop-creative-direction.json"
                                                            className="absolute inset-0"
                                                            scale={0.9}
                                                            dpi={1.25}
                                                            fps={60}
                                                            lazyLoad={false}
                                                            altText="Interactive aquatic shader inside the interactive product experiences laptop slide"
                                                            ariaLabel="Decorative Unicorn Studio shader inside the interactive product experiences laptop slide"
                                                            ariaHidden
                                                        />
                                                    </div>
                                                ) : activeService === 3 && laptopWideSlides.wideslide4 ? (
                                                    <img
                                                        src={laptopWideSlides.wideslide4}
                                                        alt=""
                                                        className="h-auto w-full self-start"
                                                    />
                                                ) : (
                                                    <div className="text-center p-8 transition-all duration-500">
                                                        <div className="font-bold tracking-[0.2em] text-accent mb-4" style={{ fontSize: 'var(--text-xs)' }}>
                                                            {currentService.displayLabel}
                                                        </div>

                                                        <div className="text-gray-500" style={{ fontSize: 'var(--text-sm)' }}>
                                                            {currentService.displayContent}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
