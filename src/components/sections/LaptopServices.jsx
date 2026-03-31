import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { laptopServices } from '../../data/services';
import UnicornScene from '../ui/UnicornScene';
import ServiceGlyph from '../ui/ServiceGlyph';

const laptopWideSlides = Object.fromEntries(
    Object.entries(
        import.meta.glob('../../../heroImages/wideslides/*.{png,jpg,jpeg,webp,avif,mp4,webm,mov}', {
            eager: true,
            import: 'default',
        })
    ).map(([path, src]) => {
        const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? path;
        return [fileName, src];
    })
);

const laptopServiceCallouts = {
    1: {
        summary: 'CMS, assets, and deployment move through one stable operating layer.',
        chips: ['Schemas', 'Asset flow', 'Deploy hooks'],
        solutionTitle: 'Stop breaking the stack every time content changes.',
        solutionDetail: 'We build the publishing and asset flow so launches, updates, and experiments stop creating technical debt.',
    },
    2: {
        summary: 'Reference drift gets tightened into a clear visual direction and execution track.',
        chips: ['References', 'Visual rules', 'Execution map'],
        solutionTitle: 'You know the work is off, but not why yet.',
        solutionDetail: 'This is the strategy pass that turns scattered feedback into a clear visual direction, system, and execution plan.',
    },
    3: {
        summary: 'Interfaces that answer product questions before the customer needs support.',
        chips: ['Hotspots', '3D states', 'Guided motion'],
        solutionTitle: 'Let customers interact before they commit.',
        solutionDetail: 'Use 3D, configurators, and guided product views to answer questions earlier and raise buying confidence.',
    },
    4: {
        summary: 'A modular brand language that holds together across launches, decks, and campaigns.',
        chips: ['Type scale', 'Color tokens', 'Launch kits'],
        solutionTitle: 'Make every brand touchpoint feel like the same company.',
        solutionDetail: 'We turn visual decisions into a repeatable system so site, campaigns, decks, and launches stay aligned.',
    },
};

export default function LaptopServices() {
    const [activeService, setActiveService] = useState(0);
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

            setActiveService((current) => (current === nextActive ? current : nextActive));
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

    const currentService = laptopServices[activeService];
    const slideKey = `laptop-slide-${activeService}`;

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

                    <div className="relative z-10 order-2 lg:order-1">
                        <div className="space-y-8 pb-40">
                            {laptopServices.map((service, index) => {
                                const cardData = laptopServiceCallouts[service.id];
                                const isActive = activeService === index;

                                return (
                                    <div
                                        key={service.id}
                                        id={service.anchorId}
                                        ref={(el) => {
                                            cardRefs.current[index] = el;
                                        }}
                                        className={`rounded-[1.8rem] border transition-[transform,box-shadow,border-color,background-color] duration-500 ${
                                            isActive
                                                ? 'border-gray-200 bg-white shadow-[0_22px_54px_rgba(15,23,42,0.08)]'
                                                : 'border-white/70 bg-white/55 shadow-[0_12px_26px_rgba(15,23,42,0.035)]'
                                        }`}
                                        style={{ scrollMarginTop: '7rem' }}
                                    >
                                        <div className="px-4 pt-5 sm:px-7 sm:pt-6">
                                            <h3 className="font-normal leading-[1.12] tracking-[-0.02em] text-gray-900" style={{ fontSize: 'var(--text-h5)' }}>
                                                {service.title}
                                            </h3>

                                            <p className="mt-3 text-gray-500 leading-relaxed" style={{ fontSize: 'var(--text-sm)' }}>
                                                {cardData?.summary ?? service.description}
                                            </p>
                                        </div>

                                        <div className="px-4 pb-6 pt-6 sm:px-7 sm:pb-7">
                                            <ServiceGlyph serviceId={service.id} isActive={isActive} chips={cardData?.chips} />

                                            {cardData?.solutionTitle ? (
                                                <div className="mt-5 border-t border-gray-100 pt-5">
                                                    <p className="mb-2 font-medium leading-[1.32] tracking-[-0.01em] text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>
                                                        {cardData.solutionTitle}
                                                    </p>
                                                    <p className="max-w-[560px] leading-[1.5] text-gray-500" style={{ fontSize: 'var(--text-xs)' }}>
                                                        {cardData.solutionDetail}
                                                    </p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="order-1 z-10 hidden lg:sticky lg:top-24 lg:flex lg:order-2">
                        <div className="relative flex w-full justify-start">
                            <div className="relative w-full max-w-[620px] rounded-[12px] border border-[#d8d5cc] bg-[#ece9e1] p-[5px] shadow-[0_18px_50px_rgba(15,23,42,0.08)] xl:max-w-[660px]">
                                <div className="relative aspect-[16/10.8] overflow-hidden rounded-[8px] bg-white xl:aspect-[16/11]">
                                    <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-white/18 to-transparent" />

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
                                                    <div className="p-8 text-center transition-all duration-500">
                                                        <div className="mb-4 font-bold tracking-[0.2em] text-accent" style={{ fontSize: 'var(--text-xs)' }}>
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
