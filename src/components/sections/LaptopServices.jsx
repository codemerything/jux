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
        <section id="laptop-services" className="relative bg-[#f5f5f0] py-24 overflow-visible" aria-labelledby="laptop-services-heading">
            <h2 id="laptop-services-heading" className="sr-only">How we work</h2>
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-start">

                    {/* Left: Scrolling Content */}
                    <div className="relative z-10 order-2 lg:order-1">
                        <div className="space-y-8 pb-40">
                            {laptopServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    ref={el => cardRefs.current[index] = el}
                                    onClick={() => toggleMobilePreview(service.id)}
                                    className={`rounded-2xl border transition-all duration-500 ${index === laptopServices.length - 1 ? 'lg:pb-16' : ''} ${activeService === index
                                        ? 'bg-white border-gray-200 shadow-lg'
                                        : 'bg-transparent border-gray-100'
                                        } ${mobilePreviewSlides[service.id] ? 'cursor-pointer lg:cursor-default' : ''}`}
                                >
                                    <div className="px-8 pt-8">
                                        <h3 className="font-bold mb-4 text-gray-900" style={{ fontSize: 'var(--text-h4)' }}>{service.title}</h3>
                                        <p className="text-gray-500 mb-6 leading-relaxed" style={{ fontSize: 'var(--text-sm)' }}>{service.description}</p>
                                    </div>

                                    {mobilePreviewSlides[service.id] ? (
                                        <div className="space-y-0">
                                            <div
                                                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                                                    mobilePreviewServiceId === service.id ? 'max-h-0 opacity-0' : 'max-h-[220px] opacity-100'
                                                }`}
                                            >
                                                <div className="px-8 pb-8">
                                                    <div className="mb-6 h-[21px]" aria-hidden="true" />

                                                    {laptopServiceCallouts[service.id] && (
                                                        <div className="pt-6 border-t border-gray-100">
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
                                                className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
                                                    mobilePreviewServiceId === service.id && laptopWideSlides[mobilePreviewSlides[service.id].key]
                                                        ? 'mt-2 max-h-[320px] opacity-100'
                                                        : 'mt-0 max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="px-2 pb-2">
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
                                        <div className="px-8 pb-8">
                                            <div className="mb-6 h-[21px]" aria-hidden="true" />

                                            {laptopServiceCallouts[service.id] && (
                                                <div className="pt-6 border-t border-gray-100">
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
                    <div className="hidden lg:flex sticky top-24 justify-center z-10 order-1 lg:order-2">
                        <div className="relative w-full flex justify-center">
                            <div className="relative w-[500px] rounded-[12px] border border-[#d8d5cc] bg-[#ece9e1] p-[5px] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                                <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-white">
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
