import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SmartLink from './SmartLink';

const processData = {
    '3D Product Rendering': {
        tagline: 'One file. Every angle, every surface, every use.',
        timeline: '2–3 weeks',
        steps: [
            {
                num: '01',
                title: 'File handoff',
                desc: 'Send us a product file, reference images, or ship the physical item. We reverse-engineer what we need.',
            },
            {
                num: '02',
                title: 'Material & lighting build',
                desc: 'We construct the 3D environment, surface materials, and camera angles in line with your brand direction.',
            },
            {
                num: '03',
                title: 'Render & review',
                desc: 'First renders go to you for feedback. Two full revision rounds are included in the starting price.',
            },
            {
                num: '04',
                title: 'Delivery',
                desc: 'All angles in PNG and WebP, organized and named. Ready for web, print, ads, or wherever they need to go.',
            },
        ],
    },
    'Packshot Sets': {
        tagline: 'Every SKU, consistent. Update files, not shoots.',
        timeline: '3–4 weeks',
        steps: [
            {
                num: '01',
                title: 'Scope & SKU map',
                desc: 'We document every SKU, colorway, angle, and output format upfront. No surprises mid-build.',
            },
            {
                num: '02',
                title: 'Model build',
                desc: '3D models built from your product files or physical samples. One master model per SKU variant.',
            },
            {
                num: '03',
                title: 'Consistent environment',
                desc: 'Every product shot on the same lighting rig, same framing. Uniform across your entire range.',
            },
            {
                num: '04',
                title: 'Living delivery',
                desc: 'When you reformulate, repackage, or add an SKU, we update the files. Not the shoot.',
            },
        ],
    },
    'Animation & Motion': {
        tagline: 'Hero reels, loops, and micro-motion. 60fps standard.',
        timeline: '2–4 weeks',
        steps: [
            {
                num: '01',
                title: 'Concept brief',
                desc: "We align on mood, pacing, and key moments. You approve the direction before a single frame is animated.",
            },
            {
                num: '02',
                title: 'Keyframe blocking',
                desc: 'A rough motion pass that locks the timing and flow. Cheaper to change now than in polish.',
            },
            {
                num: '03',
                title: 'Polish pass',
                desc: 'Motion refinement, easing, and optional sound design. The difference between smooth and premium.',
            },
            {
                num: '04',
                title: 'Multi-format export',
                desc: 'MP4, WEBM, and GIF, sized for web, social, email, and anything else in your stack.',
            },
        ],
    },
    'Creative Direction': {
        tagline: "No brief needed. Tell us what's not working.",
        timeline: 'Varies by scope',
        steps: [
            {
                num: '01',
                title: 'Discovery call',
                desc: "No deck required. We ask the right questions, listen for what's actually broken, and identify the gap.",
            },
            {
                num: '02',
                title: 'Visual audit',
                desc: 'We review your existing assets, brand touchpoints, and competitive context to find the real problems.',
            },
            {
                num: '03',
                title: 'Direction document',
                desc: 'A clear visual brief: mood, references, rationale, and a defined approach before anything is made.',
            },
            {
                num: '04',
                title: 'Execution or handoff',
                desc: 'We either build it ourselves, or hand the direction to your in-house team with everything they need.',
            },
        ],
    },
    'Interactive Product Viewer': {
        tagline: 'Let customers explore in 3D before they buy.',
        timeline: '3–5 weeks',
        steps: [
            {
                num: '01',
                title: '3D model prep',
                desc: 'Existing renders or we build from scratch, optimized for WebGL, not render farms.',
            },
            {
                num: '02',
                title: 'Viewer configuration',
                desc: 'Camera controls, hotspot overlays, ambient lighting, and UI that matches your brand system.',
            },
            {
                num: '03',
                title: 'Platform integration',
                desc: 'Embed-ready for Shopify, custom storefronts, or any web stack. We handle the technical handoff.',
            },
            {
                num: '04',
                title: 'AR layer (optional)',
                desc: "Customers place the product in their space before buying. Reduces returns. Increases confidence.",
            },
        ],
    },
    'Web & App Development': {
        tagline: 'Custom builds. Performance-first. No templates.',
        timeline: '4–10 weeks',
        steps: [
            {
                num: '01',
                title: 'Architecture',
                desc: 'We map the full build, data flow, integrations, and component structure before writing a line of code.',
            },
            {
                num: '02',
                title: 'Design system',
                desc: 'All tokens, components, and layouts agreed upfront. No redesigns mid-sprint.',
            },
            {
                num: '03',
                title: 'Sprint build',
                desc: 'Development in defined sprints with regular check-ins. You see working software, not progress updates.',
            },
            {
                num: '04',
                title: 'Launch & handoff',
                desc: 'Performance audit, QA sweep, and full documentation. You own it, you can run it.',
            },
        ],
    },
    'Brand Visual System': {
        tagline: 'One visual language. Every format, every channel.',
        timeline: '4–6 weeks',
        steps: [
            {
                num: '01',
                title: 'Brand audit',
                desc: 'We assess everything you have, what works, what conflicts, and what is missing entirely.',
            },
            {
                num: '02',
                title: 'System design',
                desc: 'Core visual tokens: color, typography, spacing, motion, and iconography, built to scale.',
            },
            {
                num: '03',
                title: 'Asset library',
                desc: 'Rendered versions of every asset type you need: product, social, editorial, retail, digital.',
            },
            {
                num: '04',
                title: 'Rollout guide',
                desc: 'How to apply the system across every channel. Your team can execute without coming back to us.',
            },
        ],
    },
    'Digital Infrastructure': {
        tagline: 'CMS, asset pipelines, integrations. Built to scale.',
        timeline: '3–6 weeks',
        steps: [
            {
                num: '01',
                title: 'Current state audit',
                desc: 'We map your existing tools, pipelines, and breakpoints. No assumptions.',
            },
            {
                num: '02',
                title: 'Architecture blueprint',
                desc: 'A clear build plan before touching anything. You approve the structure before we implement.',
            },
            {
                num: '03',
                title: 'Implementation',
                desc: 'CMS setup, third-party integrations, asset delivery pipeline, and deployment configuration.',
            },
            {
                num: '04',
                title: 'Handoff & documentation',
                desc: 'Full written documentation and team onboarding. You run it from day one.',
            },
        ],
    },
};

export default function ServiceModal({ service, onClose }) {
    const [renderedService, setRenderedService] = useState(service ?? null);
    const panelRef = useRef(null);
    const viewportRef = useRef(null);
    const openScrollYRef = useRef(0);
    const touchStartYRef = useRef(0);
    const isOpen = Boolean(service);
    const data = processData[renderedService?.name];
    const modalPrice = renderedService?.price?.replace(/^from\s+/i, '') ?? '';

    useEffect(() => {
        if (!service) {
            return undefined;
        }

        setRenderedService(service);
        openScrollYRef.current = window.scrollY;
        return undefined;
    }, [service]);

    useEffect(() => {
        if (!renderedService) {
            return undefined;
        }

        const viewport = viewportRef.current;
        const panel = panelRef.current;
        if (!viewport || !panel) {
            return undefined;
        }

        const preventBackgroundScroll = (event) => {
            if (!panel.contains(event.target)) {
                event.preventDefault();
            }
        };

        const handleTouchStart = (event) => {
            touchStartYRef.current = event.touches[0]?.clientY ?? 0;
        };

        const handleTouchMove = (event) => {
            const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
            const deltaY = currentY - touchStartYRef.current;
            const canScroll = panel.scrollHeight > panel.clientHeight + 1;

            if (!canScroll) {
                event.preventDefault();
                return;
            }

            const atTop = panel.scrollTop <= 0;
            const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
            const pullingDown = deltaY > 0;
            const pushingUp = deltaY < 0;

            if ((atTop && pullingDown) || (atBottom && pushingUp)) {
                event.preventDefault();
            }
        };

        const handleWheel = (event) => {
            const canScroll = panel.scrollHeight > panel.clientHeight + 1;

            if (!canScroll) {
                event.preventDefault();
                return;
            }

            const atTop = panel.scrollTop <= 0;
            const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
            const scrollingUp = event.deltaY < 0;
            const scrollingDown = event.deltaY > 0;

            if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
                event.preventDefault();
            }
        };

        viewport.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
        viewport.addEventListener('wheel', preventBackgroundScroll, { passive: false });
        panel.addEventListener('touchstart', handleTouchStart, { passive: true });
        panel.addEventListener('touchmove', handleTouchMove, { passive: false });
        panel.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            viewport.removeEventListener('touchmove', preventBackgroundScroll);
            viewport.removeEventListener('wheel', preventBackgroundScroll);
            panel.removeEventListener('touchstart', handleTouchStart);
            panel.removeEventListener('touchmove', handleTouchMove);
            panel.removeEventListener('wheel', handleWheel);
        };
    }, [renderedService]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleRequestClose = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        onClose();
    };

    const handleExitComplete = () => {
        if (service) {
            return;
        }

        const targetScrollY = openScrollYRef.current;
        setRenderedService(null);

        if (typeof targetScrollY === 'number' && Math.abs(window.scrollY - targetScrollY) > 2) {
            window.scrollTo({ top: targetScrollY, left: 0, behavior: 'auto' });
        }
    };

    if (typeof document === 'undefined' || !renderedService || !data) {
        return null;
    }

    return createPortal((
        <AnimatePresence onExitComplete={handleExitComplete}>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleRequestClose}
                    />

                    {/* Modal panel */}
                    <div
                        ref={viewportRef}
                        className="fixed inset-0 z-[9991] overscroll-none touch-none flex items-end justify-center lg:items-center lg:p-6"
                    >
                    <motion.div
                        ref={panelRef}
                        key="modal"
                        className="relative w-full max-h-[90vh] overflow-y-auto overscroll-contain
                            bg-[#111] border-t border-white/10 rounded-t-3xl shadow-[0_32px_90px_rgba(0,0,0,0.45)]
                            lg:max-w-3xl lg:max-h-[60vh] lg:rounded-3xl lg:border"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            touchAction: 'pan-y',
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleRequestClose}
                            className="absolute right-4 top-4 z-10 shrink-0 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15
                                flex items-center justify-center text-white/60 hover:text-white
                                transition-colors duration-150 lg:right-6 lg:top-6"
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        {/* Handle bar (mobile) */}
                        <div className="lg:hidden flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-white/20" />
                        </div>

                        <div className="relative p-8 lg:p-10">
                            {/* Header */}
                            <div className="mb-8 pr-12 lg:pr-16">
                                <div>
                                    <h3
                                        className="font-bold text-white leading-tight"
                                        style={{ fontSize: 'clamp(calc(var(--text-h4) * 0.95), 6.5vw, var(--text-h3))' }}
                                    >
                                        {renderedService.name}
                                    </h3>
                                    <p
                                        className="text-white/50 mt-2"
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    >
                                        {data.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/8 mb-6" />

                            <p
                                className="text-white/30 uppercase tracking-widest font-semibold mb-5"
                                style={{ fontSize: 'var(--text-xs)' }}
                            >
                                How it works
                            </p>

                            {/* 2×2 grid so steps fit in a shorter modal */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                                {data.steps.map((step, i) => (
                                    <motion.div
                                        key={step.num}
                                        className="flex gap-4"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07, duration: 0.3 }}
                                    >
                                        {/* Step number circle */}
                                        <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                                            <span
                                                className="text-accent font-bold"
                                                style={{ fontSize: 'var(--text-xs)' }}
                                            >
                                                {step.num}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h4
                                                className="font-semibold text-white mb-1"
                                                style={{ fontSize: 'var(--text-h6)' }}
                                            >
                                                {step.title}
                                            </h4>
                                            <p
                                                className="text-white/50 leading-relaxed"
                                                style={{ fontSize: 'var(--text-sm)' }}
                                            >
                                                {step.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer CTA */}
                            <div className="border-t border-white/8 pt-6 flex items-center justify-between gap-4">
                                <div>
                                    <p
                                        className="text-white/30 uppercase tracking-widest font-semibold leading-none mb-0"
                                        style={{ fontSize: 'var(--text-xs)' }}
                                    >
                                        Starting from
                                    </p>
                                    <p
                                        className="-mt-1 font-bold leading-[0.92] text-white"
                                        style={{ fontSize: 'var(--text-h4)' }}
                                    >
                                        {modalPrice}
                                    </p>
                                </div>
                                <SmartLink
                                    href="/contact"
                                    onClick={handleRequestClose}
                                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold
                                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                                    style={{ fontSize: 'var(--text-sm)' }}
                                >
                                    Start this project
                                </SmartLink>
                            </div>
                        </div>
                    </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    ), document.body);
}
