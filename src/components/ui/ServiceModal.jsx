import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const data = processData[service?.name];

    // Lock body scroll
    useEffect(() => {
        if (service) {
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = ''; };
    }, [service]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <AnimatePresence>
            {service && data && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-9990 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal panel */}
                    <motion.div
                        key="modal"
                        className="fixed inset-x-0 bottom-0 z-9991 max-h-[90vh] overflow-y-auto
                            bg-[#111] border-t border-white/10 rounded-t-3xl
                            lg:inset-0 lg:m-auto lg:rounded-3xl lg:max-w-3xl lg:max-h-[60vh] lg:border lg:border-white/10"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Handle bar (mobile) */}
                        <div className="lg:hidden flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-white/20" />
                        </div>

                        <div className="p-8 lg:p-10">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <p
                                        className="text-white/30 uppercase tracking-widest font-semibold mb-2"
                                        style={{ fontSize: 'var(--text-xs)' }}
                                    >
                                        {service.category} · {data.timeline}
                                    </p>
                                    <h3
                                        className="font-bold text-white leading-tight"
                                        style={{ fontSize: 'var(--text-h3)' }}
                                    >
                                        {service.name}
                                    </h3>
                                    <p
                                        className="text-white/50 mt-2"
                                        style={{ fontSize: 'var(--text-sm)' }}
                                    >
                                        {data.tagline}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="ml-4 mt-1 shrink-0 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15
                                        flex items-center justify-center text-white/60 hover:text-white
                                        transition-colors duration-150"
                                    aria-label="Close"
                                >
                                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                        className="text-white/30 uppercase tracking-widest font-semibold mb-1"
                                        style={{ fontSize: 'var(--text-xs)' }}
                                    >
                                        Starting from
                                    </p>
                                    <p
                                        className="font-extrabold text-white"
                                        style={{ fontSize: 'var(--text-h4)' }}
                                    >
                                        {service.price}
                                    </p>
                                </div>
                                <a
                                    href="#contact"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold
                                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                                    style={{ fontSize: 'var(--text-sm)' }}
                                >
                                    Start this project
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
