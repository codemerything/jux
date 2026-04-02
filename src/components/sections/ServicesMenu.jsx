import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScratchPrice from '../ui/ScratchPrice';
import ServiceModal from '../ui/ServiceModal';
import SmartLink from '../ui/SmartLink';

const groups = {
    Visual: [
        {
            category: 'Visual',
            name: '3D Product Rendering',
            description: 'One file. Every angle, every surface, every use.',
            price: 'from $2,500',
            tag: null,
        },
        {
            category: 'Visual',
            name: 'Packshot Sets',
            description: 'Every SKU, consistent. Update files, not shoots.',
            price: 'from $3,500',
            tag: null,
        },
        {
            category: 'Visual',
            name: 'Animation & Motion',
            description: 'Hero reels, loops, and micro-motion. 60fps standard.',
            price: 'from $4,500',
            tag: null,
        },
        {
            category: 'Visual',
            name: 'Creative Direction',
            description: "No brief needed. Tell us what's not working.",
            price: 'on enquiry',
            tag: null,
        },
    ],
    Digital: [
        {
            category: 'Digital',
            name: 'Interactive Product Viewer',
            description: 'Let customers explore in 3D before they buy.',
            price: 'from $8,000',
            tag: null,
        },
        {
            category: 'Digital',
            name: 'Web & App Development',
            description: 'Custom builds. Performance-first. No templates.',
            price: 'from $12,000',
            tag: null,
        },
        {
            category: 'Digital',
            name: 'Brand Visual System',
            description: 'One visual language. Every format, every channel.',
            price: 'from $18,000',
            tag: null,
        },
        {
            category: 'Digital',
            name: 'Digital Infrastructure',
            description: 'CMS, asset pipelines, integrations. Built to scale.',
            price: 'on enquiry',
            tag: null,
        },
    ],
};

export default function ServicesMenu() {
    const [activeTab, setActiveTab] = useState('Visual');
    const [activeService, setActiveService] = useState(null);
    const services = groups[activeTab];

    // Track pointer-start position to distinguish a scratch-drag from a tap
    const pointerStart = useRef(null);
    const DRAG_THRESHOLD = 6; // px; anything larger is a drag, not a click
    const handleCardOpen = (service, event) => {
        if (!pointerStart.current) {
            setActiveService(service);
            return;
        }

        const dx = event.clientX - pointerStart.current.x;
        const dy = event.clientY - pointerStart.current.y;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
            return;
        }

        setActiveService(service);
    };

    return (
        <>
            <ServiceModal service={activeService} onClose={() => setActiveService(null)} />

            <section
                id="pricing"
                className="bg-[#fafafa] pt-[200px] md:pt-[320px] pb-32 relative"
                aria-labelledby="services-menu-heading"
            >
                {/* Seamless Black-to-White Seamless Entrance Fade */}
                <div 
                    className="pointer-events-none absolute left-0 top-0 z-[1] w-full h-[180px] md:h-[260px]"
                    style={{ 
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 15%, rgba(0, 0, 0, 0.65) 30%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.28) 60%, rgba(0, 0, 0, 0.15) 75%, rgba(0, 0, 0, 0.05) 88%, rgba(0, 0, 0, 0) 100%)' 
                    }}
                    aria-hidden="true"
                />

                <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
                    {/* Header + Tab switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
                        <div>
                            <p
                                className="text-gray-400 uppercase tracking-[0.2em] font-semibold mb-3"
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                What we build
                            </p>
                            <h2
                                id="services-menu-heading"
                                className="font-bold text-gray-900 leading-tight mb-6"
                                style={{ fontSize: 'var(--text-h2)' }}
                            >
                                Services
                            </h2>

                            <div className="inline-flex gap-1 bg-gray-100 rounded-xl p-1">
                                {['Visual', 'Digital'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                            activeTab === tab
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p
                            className="text-gray-500 max-w-xs leading-relaxed sm:text-right"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            Most projects combine services. Prices are starting points, and scope shapes the final number.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            {services.map((service, index) => (
                                <motion.button
                                    key={service.name}
                                    onPointerDown={(event) => {
                                        pointerStart.current = { x: event.clientX, y: event.clientY };
                                    }}
                                    onPointerUp={(event) => {
                                        handleCardOpen(service, event);
                                    }}
                                    onClick={(event) => {
                                        handleCardOpen(service, event);
                                    }}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.32, delay: index * 0.06, ease: 'easeOut' }}
                                    className="flex flex-col text-left group relative h-full w-full bg-white border border-gray-200 hover:border-gray-300 rounded-3xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition-all duration-500 min-h-[250px] lg:min-h-[320px]"
                                    style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                                >
                                    {/* Tech Status Header - Light Mode Version */}
                                    <div className="w-full block mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-all duration-500"></div>
                                            <span className="font-mono text-gray-400 group-hover:text-gray-900 tracking-widest uppercase text-[10px] md:text-xs transition-colors duration-500">
                                                MOD_{index + 1}.0 / {service.category}
                                            </span>
                                        </div>
                                        <h3 
                                            className="font-bold text-gray-900 mt-5 block group-hover:text-black transition-colors duration-300"
                                            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                                        >
                                            {service.name}
                                        </h3>
                                        <p className="mt-3 block text-gray-500 leading-relaxed max-w-sm">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Footer Content bridging to ScratchPrice */}
                                    <div className="mt-auto w-full border-t border-gray-100 pt-5 group-hover:border-gray-200 transition-colors duration-500">
                                        <ScratchPrice price={service.price} />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}
