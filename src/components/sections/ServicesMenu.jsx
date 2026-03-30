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
                className="bg-[#0d0d0d] py-24"
                aria-labelledby="services-menu-heading"
            >
                <div className="max-w-[1400px] mx-auto px-8">

                    {/* ── Header + Tab switcher ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
                        <div>
                            <p
                                className="text-white/30 uppercase tracking-[0.2em] font-semibold mb-3"
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                What we build
                            </p>
                            <h2
                                id="services-menu-heading"
                                className="font-bold text-white leading-tight mb-6"
                                style={{ fontSize: 'var(--text-h2)' }}
                            >
                                Services
                            </h2>

                            {/* Tab pills */}
                            <div className="inline-flex gap-1 bg-white/6 rounded-xl p-1">
                                {['Visual', 'Digital'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-white/50 hover:text-white'
                                            }`}
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p
                            className="text-white/40 max-w-xs leading-relaxed sm:text-right"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            Most projects combine services. Prices are starting points, and scope shapes the final number.
                        </p>
                    </div>

                    {/* ── Card grid (4 at a time) ── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            {services.map((s, i) => (
                                <motion.button
                                    key={s.name}
                                    onPointerDown={(e) => {
                                        pointerStart.current = { x: e.clientX, y: e.clientY };
                                    }}
                                    onPointerUp={(e) => {
                                        handleCardOpen(s, e);
                                    }}
                                    onClick={(e) => {
                                        handleCardOpen(s, e);
                                    }}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.32, delay: i * 0.06, ease: 'easeOut' }}
                                    className="group relative flex flex-col text-left
                                        bg-white/4 hover:bg-white/8
                                        border border-white/6 hover:border-white/15
                                        rounded-2xl p-7
                                        transition-all duration-200
                                        cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                                >
                                    {/* Tag, hidden if null */}
                                    {s.tag && (
                                        <span
                                            className="absolute top-5 right-5 bg-accent/15 text-accent font-semibold px-2.5 py-0.5 rounded-full"
                                            style={{ fontSize: 'var(--text-xs)' }}
                                        >
                                            {s.tag}
                                        </span>
                                    )}

                                    {/* Name */}
                                    <h3
                                        className="font-bold text-white mb-3 group-hover:text-accent transition-colors duration-200 leading-snug"
                                        style={{ fontSize: 'var(--text-h4)' }}
                                    >
                                        {s.name}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        className="text-white/50 leading-relaxed mb-8 flex-1"
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    >
                                        {s.description}
                                    </p>

                                    {/* Price */}
                                    <div className="border-t border-white/6 pt-5 mb-4">
                                        <ScratchPrice price={s.price} />
                                    </div>

                                </motion.button>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* ── Footer CTA ── */}
                    <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <p className="text-white/40 leading-relaxed" style={{ fontSize: 'var(--text-sm)' }}>
                            Tell us what you're building, and we'll tell you what it takes.
                        </p>
                        <SmartLink
                            href="/contact"
                            className="shrink-0 inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            Start a Project
                        </SmartLink>
                    </div>
                </div>
            </section>
        </>
    );
}
