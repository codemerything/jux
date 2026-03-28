import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UnicornHeroBackground from '../components/ui/UnicornHeroBackground';

const serviceOptions = [
    '3D & Packshots',
    'Motion & Creative',
    'Web & Interactive',
];

const budgetOptions = ['$5K', '$10K', '$20K', '$40K', '$75K+'];
const timelineOptions = ['02 WEEKS', '04 WEEKS', '06 WEEKS', '08 WEEKS', '12 WEEKS'];
const formspreeFormId = import.meta.env.VITE_FORMSPREE_FORM_ID;

function TextField({ label, as = 'input', className = '', ...props }) {
    const Element = as;
    const fieldChromeStyle = {
        backgroundImage: `
            linear-gradient(180deg, rgba(255,255,255,0.985) 0%, rgba(249,249,247,0.96) 100%),
            linear-gradient(90deg, rgba(15,23,42,0.14) 0%, rgba(15,23,42,0.08) 42%, rgba(15,23,42,0.028) 100%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
    };

    return (
        <label className="block">
            <span
                className="sr-only"
            >
                {label}
            </span>
            <Element
                className={`w-full rounded-[1.15rem] border border-transparent bg-white px-4 py-3.5 text-[15px] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_18px_rgba(15,23,42,0.025)] outline-none transition focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_24px_rgba(15,23,42,0.035)] focus:ring-4 focus:ring-slate-900/3 ${className}`}
                style={fieldChromeStyle}
                {...props}
            />
        </label>
    );
}

function SliderField({ label, helper, options, value, onChange }) {
    const pillBuffer = 3;
    const [isDragging, setIsDragging] = useState(false);
    const [edgeStretch, setEdgeStretch] = useState(null);
    const trackRef = useRef(null);
    const innerTrackRef = useRef(null);
    const pillRef = useRef(null);
    const [pillWidth, setPillWidth] = useState(0);
    const [trackWidth, setTrackWidth] = useState(0);
    const percent = options.length > 1 ? (value / (options.length - 1)) * 100 : 0;
    const isAtTrackEdge = value === 0 || value === options.length - 1;
    const labelAlignment = percent <= 8 ? 'start' : percent >= 92 ? 'end' : 'center';
    const anchorPx = trackWidth * (percent / 100);
    const pillLeft = labelAlignment === 'start'
        ? anchorPx - pillBuffer
        : labelAlignment === 'end'
            ? anchorPx - pillWidth - pillBuffer
            : anchorPx - pillWidth / 2 - pillBuffer;
    const fillWidth = Math.max(0, Math.min(trackWidth, pillLeft + pillWidth));
    const cardChromeStyle = {
        backgroundImage: `
            linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(249,249,247,0.97) 46%, rgba(245,244,240,0.93) 100%),
            linear-gradient(90deg, rgba(15,23,42,0.14) 0%, rgba(15,23,42,0.08) 42%, rgba(15,23,42,0.028) 100%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
    };
    const pillChromeStyle = {
        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.998) 0%, rgba(251,252,253,0.985) 58%, rgba(247,249,251,0.96) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.96), inset 1px 1px 0 rgba(255,255,255,0.72)',
    };

    useEffect(() => {
        if (!isDragging) {
            return undefined;
        }

        const updateValueFromPointer = (clientX) => {
            const track = trackRef.current;
            if (!track) {
                return;
            }

            const bounds = track.getBoundingClientRect();
            const rawProgress = (clientX - bounds.left) / bounds.width;
            const clampedProgress = Math.min(1, Math.max(0, rawProgress));
            const nextValue = Math.round(clampedProgress * (options.length - 1));

            setEdgeStretch(rawProgress < 0 ? 'start' : rawProgress > 1 ? 'end' : null);

            if (nextValue !== value) {
                onChange(nextValue);
            }
        };

        const handlePointerMove = (event) => {
            updateValueFromPointer(event.clientX);
        };

        const endDrag = () => {
            setIsDragging(false);
            setEdgeStretch(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', endDrag);
            window.removeEventListener('pointercancel', endDrag);
        };
    }, [isDragging, onChange, options.length, value]);

    useEffect(() => {
        const syncSizes = () => {
            setPillWidth(pillRef.current?.offsetWidth ?? 0);
            setTrackWidth(innerTrackRef.current?.offsetWidth ?? 0);
        };

        syncSizes();

        const resizeObserver = new ResizeObserver(syncSizes);

        if (pillRef.current) {
            resizeObserver.observe(pillRef.current);
        }

        if (innerTrackRef.current) {
            resizeObserver.observe(innerTrackRef.current);
        }

        window.addEventListener('resize', syncSizes);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', syncSizes);
        };
    }, [options, value]);

    const handlePointerDown = (event) => {
        const track = trackRef.current;
        if (!track) {
            return;
        }

        event.preventDefault();
        setIsDragging(true);

        const bounds = track.getBoundingClientRect();
        const rawProgress = (event.clientX - bounds.left) / bounds.width;
        const clampedProgress = Math.min(1, Math.max(0, rawProgress));
        const nextValue = Math.round(clampedProgress * (options.length - 1));

        setEdgeStretch(rawProgress < 0 ? 'start' : rawProgress > 1 ? 'end' : null);

        if (nextValue !== value) {
            onChange(nextValue);
        }
    };

    return (
        <div
            className="rounded-[1.5rem] border border-transparent bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_16px_38px_rgba(15,23,42,0.04)] sm:p-6"
            style={cardChromeStyle}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {label}
                    </p>
                    <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-slate-500">
                        {helper}
                    </p>
                </div>
            </div>

            <div className="relative mt-8">
                <div
                    ref={trackRef}
                    onPointerDown={handlePointerDown}
                    className={`relative h-[64px] overflow-visible rounded-full border border-black/8 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_30px_rgba(15,23,42,0.06)] touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-ew-resize'}`}
                >
                    <div className="absolute inset-y-2 left-2 right-2 rounded-full bg-black/[0.07]" />
                    <div ref={innerTrackRef} className="absolute inset-y-0 left-2 right-2">
                        <motion.div
                            className="absolute inset-y-2 left-0 rounded-full bg-slate-900"
                            animate={{
                                width: fillWidth,
                                opacity: fillWidth === 0 ? 0 : 1,
                            }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <motion.div
                            className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-[3px]"
                            animate={{
                                left: pillLeft,
                                scaleX: edgeStretch
                                    ? 1.08
                                    : isDragging && isAtTrackEdge
                                        ? 1.04
                                        : 1,
                                scaleY: edgeStretch
                                    ? 0.92
                                    : isDragging && isAtTrackEdge
                                        ? 0.96
                                        : 1,
                            }}
                            transition={{
                                left: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                                scaleX: { duration: 0.16, ease: 'easeOut' },
                                scaleY: { duration: 0.16, ease: 'easeOut' },
                            }}
                            style={{
                                transformOrigin: edgeStretch === 'start' ? 'left center' : edgeStretch === 'end' ? 'right center' : 'center center',
                            }}
                        >
                            <div
                                ref={pillRef}
                                className="relative inline-flex min-h-[48px] items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-transparent bg-white px-6 py-3.5 text-sm font-semibold tracking-[-0.03em] text-slate-900"
                                style={{
                                    ...pillChromeStyle,
                                }}
                            >
                                <motion.span
                                    className="pointer-events-none absolute inset-0 rounded-full"
                                    animate={{
                                        opacity: isDragging ? 0.62 : 0,
                                        boxShadow: isDragging
                                            ? 'inset 0 12px 20px rgba(255,255,255,0.46), inset 0 -10px 18px rgba(96,165,250,0.18), inset 14px 0 18px rgba(255,255,255,0.2), inset -14px 0 20px rgba(125,211,252,0.2), 0 0 22px rgba(147,197,253,0.18)'
                                            : 'inset 0 0 0 rgba(147,197,253,0), 0 0 0 rgba(147,197,253,0)',
                                    }}
                                    transition={{
                                        duration: isDragging ? 0.16 : 0.32,
                                        ease: 'easeOut',
                                    }}
                                    style={{
                                        background: `
                                            radial-gradient(145% 140% at 50% 52%, rgba(255,255,255,0.98) 0%, rgba(248,252,255,0.94) 22%, rgba(219,234,254,0.76) 48%, rgba(186,230,253,0.38) 68%, rgba(255,255,255,0) 100%),
                                            radial-gradient(82% 44% at 50% 22%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.68) 40%, rgba(255,255,255,0.06) 100%),
                                            radial-gradient(74% 54% at 24% 44%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 100%),
                                            radial-gradient(78% 58% at 78% 62%, rgba(125,211,252,0.24) 0%, rgba(191,219,254,0.08) 46%, rgba(255,255,255,0) 100%),
                                            linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%, rgba(96,165,250,0.08) 100%)
                                        `,
                                    }}
                                />
                                <span className="relative z-10">{options[value]}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default function ContactPage() {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        subscribe: false,
    });
    const [selectedServices, setSelectedServices] = useState(['3D & Packshots']);
    const [budgetIndex, setBudgetIndex] = useState(0);
    const [timelineIndex, setTimelineIndex] = useState(0);
    const [submitState, setSubmitState] = useState('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [showSuccessNotice, setShowSuccessNotice] = useState(false);

    const updateField = (event) => {
        const { name, value, type, checked } = event.target;

        setFormValues((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const toggleService = (service) => {
        setSelectedServices((current) => (
            current.includes(service)
                ? current.filter((item) => item !== service)
                : [...current, service]
        ));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formspreeFormId) {
            setSubmitState('error');
            setSubmitMessage('Add VITE_FORMSPREE_FORM_ID to your env file to enable submissions.');
            setShowSuccessNotice(false);
            return;
        }

        setSubmitState('submitting');
        setSubmitMessage('');
        setShowSuccessNotice(false);

        try {
            const response = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: formValues.name,
                    email: formValues.email,
                    company: formValues.company,
                    phone: formValues.phone,
                    message: formValues.message,
                    services: selectedServices.join(', '),
                    budget: budgetOptions[budgetIndex],
                    timeline: timelineOptions[timelineIndex],
                    subscribe: formValues.subscribe ? 'Yes' : 'No',
                    source: 'JUX contact page',
                    _subject: `JUX inquiry from ${formValues.name || formValues.email}`,
                }),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                const apiMessage = Array.isArray(result?.errors)
                    ? result.errors.map((item) => item.message).join(' ')
                    : '';
                throw new Error(apiMessage || 'Form submission failed.');
            }

            setSubmitState('submitted');
            setSubmitMessage('Thanks. Your project details were sent.');
            setShowSuccessNotice(true);
            setFormValues({
                name: '',
                email: '',
                company: '',
                phone: '',
                message: '',
                subscribe: false,
            });
            setSelectedServices(['3D & Packshots']);
            setBudgetIndex(0);
            setTimelineIndex(2);
        } catch (error) {
            setSubmitState('error');
            setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
            setShowSuccessNotice(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {showSuccessNotice && (
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed left-1/2 top-6 z-[80] w-[min(calc(100vw-3rem),420px)] -translate-x-1/2"
                >
                    <div className="rounded-[1.5rem] border border-black/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.99)_0%,rgba(249,249,247,0.98)_44%,rgba(245,244,240,0.94)_100%)] p-5 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Form Submitted
                                </p>
                                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                                    Thanks. Your project details were sent.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSuccessNotice(false)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-slate-500 transition hover:border-black/12 hover:text-slate-900"
                                aria-label="Close submission notice"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            <div className="relative overflow-hidden">
                <UnicornHeroBackground />
                <div className="absolute inset-0 bg-black/52" />
                <div className="pointer-events-none absolute inset-0 opacity-80">
                    <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
                    <div className="absolute right-0 top-12 h-96 w-96 rounded-full bg-white/6 blur-3xl" />
                </div>

                <Navbar />

                <section className="relative z-10 px-6 pb-18 pt-40 sm:px-8 sm:pt-44 md:pb-24">
                    <div className="mx-auto w-full max-w-4xl lg:translate-x-5 xl:translate-x-8" style={{ maxWidth: '56rem' }}>
                        <div className="max-w-[760px]">
                            <h1
                                className="max-w-[14ch] font-extrabold leading-[0.98] tracking-[-0.05em] text-white"
                                style={{ fontSize: 'clamp(2rem, 5vw, var(--text-h1))' }}
                            >
                                Let&apos;s build the part that sells it.
                            </h1>
                            <p className="mt-6 max-w-[620px] text-base leading-relaxed text-white/68 sm:text-lg">
                                Send the basics. We&apos;ll review the scope, pressure-test the timeline, and tell you whether it should be 3D, motion, development, or a mix.
                            </p>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {['Reply within 1 business day', 'Built for product brands', 'Best for active launches and rebrands'].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[12px] font-medium tracking-[-0.01em] text-white/74 backdrop-blur-xl"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <main className="relative z-10 flex-1 bg-[#f7f6f1] text-slate-900">
                <section className="px-6 py-14 sm:px-8 md:py-18">
                    <div className="mx-auto grid max-w-[1280px] gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-8 md:p-10"
                        >
                            <div className="mb-10 flex flex-col gap-3 border-b border-black/8 pb-8 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-900">
                                        Send the scope.
                                    </h2>
                                </div>
                                <p className="max-w-[30rem] text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                                    A few specifics help us price and plan it faster.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <TextField
                                    label="Name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Your name"
                                    required
                                    value={formValues.name}
                                    onChange={updateField}
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@company.com"
                                    required
                                    value={formValues.email}
                                    onChange={updateField}
                                />
                                <TextField
                                    label="Company"
                                    name="company"
                                    type="text"
                                    autoComplete="organization"
                                    placeholder="Brand or company"
                                    required
                                    value={formValues.company}
                                    onChange={updateField}
                                />
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="Optional"
                                    value={formValues.phone}
                                    onChange={updateField}
                                />
                            </div>

                            <div className="mt-8">
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    What are you looking for?
                                </p>
                                <div className="grid gap-2.5 sm:grid-cols-3">
                                    {serviceOptions.map((service) => {
                                        const isSelected = selectedServices.includes(service);

                                        return (
                                            <button
                                                key={service}
                                                type="button"
                                                onClick={() => toggleService(service)}
                                                className={`w-full rounded-full border px-4 py-3 text-center text-sm font-medium tracking-[-0.02em] transition ${isSelected
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]'
                                                    : 'border-black/8 bg-[#fbfaf6] text-slate-600 hover:border-black/16 hover:bg-white hover:text-slate-900'
                                                    }`}
                                            >
                                                {service}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                                <SliderField
                                    label="Budget"
                                    helper="Just a ballpark starting range."
                                    options={budgetOptions}
                                    value={budgetIndex}
                                    onChange={setBudgetIndex}
                                />
                                <SliderField
                                    label="Timeline"
                                    helper="How quickly does this need to ship?"
                                    options={timelineOptions}
                                    value={timelineIndex}
                                    onChange={setTimelineIndex}
                                />
                            </div>

                            <div className="mt-8">
                                <TextField
                                    as="textarea"
                                    label="Project Details"
                                    name="message"
                                    rows="7"
                                    placeholder="Tell us what you're launching, what isn't working yet, and what deliverables you already know you need."
                                    required
                                    value={formValues.message}
                                    onChange={updateField}
                                    className="resize-none"
                                />
                            </div>

                            <div className="mt-8 flex flex-col gap-5 border-t border-black/8 pt-7 md:flex-row md:items-center md:justify-between">
                                <label className="inline-flex items-center gap-3 text-sm text-slate-500">
                                    <input
                                        type="checkbox"
                                        name="subscribe"
                                        checked={formValues.subscribe}
                                        onChange={updateField}
                                        className="h-4 w-4 rounded border-black/15 text-slate-900 focus:ring-slate-900/15"
                                    />
                                    Receive occasional studio updates
                                </label>

                                <div className="flex flex-col items-start gap-3 md:items-end">
                                    <button
                                        type="submit"
                                        disabled={submitState === 'submitting'}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.18)]"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21.5 3.5 10 15" />
                                            <path d="m21.5 3.5-7 17-2.5-5.5-5.5-2.5 17-8.5Z" />
                                        </svg>
                                        {submitState === 'submitting' ? 'Sending...' : 'Send Project Details'}
                                    </button>
                                    {submitState === 'error' && (
                                        <p className={`text-right text-[12px] ${submitState === 'error' ? 'text-rose-500' : 'text-slate-500'}`}>
                                            {submitMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>

                        <aside className="xl:pt-4">
                            <div className="xl:sticky xl:top-28 space-y-4">
                                <div className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                                        What Happens Next
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        {[
                                            'We review the scope and make sure the deliverables match the goal.',
                                            'If it fits, we book the call and map the right production path.',
                                            'If it does not, we will say so quickly instead of dragging it out.',
                                        ].map((item, index) => (
                                            <div key={item} className="flex gap-3">
                                                <span className="mt-0.5 inline-flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-[#f6f5f0] text-[10px] font-medium text-slate-500">
                                                    0{index + 1}
                                                </span>
                                                <p className="text-[14px] leading-[1.8] text-slate-500">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.75rem] border border-black/8 bg-[#f3f2ec] p-6">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                                        Best Fit
                                    </p>
                                    <p className="mt-3 text-[14px] leading-[1.8] text-slate-500">
                                        Product brands with active launches, packaging updates, paid creative needs, or product pages that need more than a template.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
