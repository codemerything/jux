import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqItems = [
    {
        question: "What does a project typically cost?",
        answer: "Projects start at $10,000. That reflects the scope of what we build, not just renders, but the visual infrastructure your brand runs on. We work with a small number of brands at a time, so the work gets our full attention. The first call is free. No pitch, no deck, just a conversation.",
    },
    {
        question: "Do you work with brands that already have a creative team?",
        answer: "Yes. Most of our clients have in-house creative. We handle what's hard to do internally, high-fidelity 3D, motion, and custom development, without disrupting your process. We've worked alongside brand teams at every stage.",
    },
    {
        question: "What do you need from us to get started?",
        answer: "A product file or physical sample, your brand assets, and 30 minutes. That's it. No formal brief required. The call does more work than a 10-page deck ever has.",
    },
    {
        question: "How is 3D rendering different from product photography?",
        answer: "Photography gives you an image. 3D gives you a file. Every time you change a colorway, reformulate packaging, or launch a new SKU, photography means rescheduling a studio, rebooking a photographer, reshipping products. With 3D, we update the model. The initial investment is higher. Every revision after that costs a fraction of a reshoot.",
    },
    {
        question: "How long does a project take?",
        answer: "Rendering projects typically run 2-4 weeks from briefing to delivery. Your launch is happening either way, and the question is whether you go in with the right visuals. We'll give you a realistic timeline after the first call, not a number designed to win the pitch.",
    },
    {
        question: "An AI can build a page in an hour. Why would I pay for development?",
        answer: "It can. What it can't do is make your product look like it belongs in a Sephora, a Goop editorial, or a premium retail shelf. AI tools produce generic. They have no taste, no DTC category knowledge, no understanding of how a 30ml serum should feel on a page vs. a supplement stack. We build pages where the 3D assets, the layout, the performance, and the brand system are designed together by the same team. The difference isn't the code, it's the coherence.",
    },
    {
        question: "What file formats do you deliver?",
        answer: "Whatever you need: PNG, WebP, MP4, WEBM, GLB for 3D viewers, and more. Assets come organized, named, and ready to use, not a zip file full of mystery layers.",
    },
    {
        question: "How many brands do you take on at once?",
        answer: "A small number at a time, deliberately. The DTC brands reaching out right now are in beauty, skincare, cannabis, and supplements. If you're in a similar space and want a slot, now is the right time to reach out.",
    },
];

export default function CTA() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="relative bg-[#fafafa] py-32" aria-labelledby="cta-heading">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
                
                {/* 2-Column Editorial Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24 relative">
                    
                    {/* Left Column: Sticky Title */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <h2
                            id="cta-heading"
                            className="font-bold text-gray-900 leading-tight mb-6"
                            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.02em' }}
                        >
                            Questions we hear <br /> most often.
                        </h2>
                        <p className="text-gray-500 max-w-sm leading-relaxed text-lg lg:text-xl">
                            Everything you need to know about how we work, what we charge, and what we deliver.
                        </p>
                    </div>

                    {/* Right Column: Accordion List */}
                    <div className="flex flex-col border-t border-gray-200">
                        {faqItems.map((item, index) => {
                            const isOpen = openIndex === index;
                            
                            return (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 overflow-hidden"
                                >
                                    {/* Question Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full text-left py-8 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition-colors duration-300"
                                    >
                                        <span
                                            className={`font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}
                                            style={{ fontSize: 'clamp(1.25rem, 2.8vw, 1.75rem)', letterSpacing: '-0.01em', lineHeight: 1.3 }}
                                        >
                                            {item.question}
                                        </span>
                                        
                                        {/* Animated + / x Icon */}
                                        <span className={`shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-gray-900 bg-gray-900 shadow-md' : 'group-hover:border-gray-400 group-hover:bg-gray-50'}`}>
                                            <motion.span
                                                animate={{ rotate: isOpen ? 45 : 0 }}
                                                transition={{ duration: 0.3, ease: 'backOut' }}
                                                className={`block font-light text-2xl leading-none origin-center ${isOpen ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`}
                                            >
                                                +
                                            </motion.span>
                                        </span>
                                    </button>

                                    {/* Silky Animated Answer Container */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.19, 1.0, 0.22, 1.0] }}
                                            >
                                                <div className="pb-10 pr-4 md:pr-16">
                                                    <p className="text-gray-600 leading-relaxed text-lg lg:text-xl">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
