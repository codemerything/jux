import { useState } from 'react';

const faqItems = [
    {
        question: "What does a project typically cost?",
        answer: "Projects start at $10,000. That reflects the scope of what we build — not just renders, but the visual infrastructure your brand runs on. We work with a small number of brands at a time, so the work gets our full attention. The first call is free. No pitch, no deck — just a conversation.",
    },
    {
        question: "Do you work with brands that already have a creative team?",
        answer: "Yes. Most of our clients have in-house creative. We handle what's hard to do internally — high-fidelity 3D, motion, and custom development — without disrupting your process. We've worked alongside brand teams at every stage.",
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
        answer: "Rendering projects typically run 2–4 weeks from briefing to delivery. Your launch is happening either way — the question is whether you go in with the right visuals. We'll give you a realistic timeline after the first call, not a number designed to win the pitch.",
    },
    {
        question: "An AI can build a page in an hour. Why would I pay for development?",
        answer: "It can. What it can't do is make your product look like it belongs in a Sephora, a Goop editorial, or a premium retail shelf. AI tools produce generic. They have no taste, no DTC category knowledge, no understanding of how a 30ml serum should feel on a page vs. a supplement stack. We build pages where the 3D assets, the layout, the performance, and the brand system are designed together by the same team. The difference isn't the code — it's the coherence.",
    },
    {
        question: "What file formats do you deliver?",
        answer: "Whatever you need: PNG, WebP, MP4, WEBM, GLB for 3D viewers, and more. Assets come organized, named, and ready to use — not a zip file full of mystery layers.",
    },
    {
        question: "How many brands do you take on at once?",
        answer: "A small number at a time — deliberately. The DTC brands reaching out right now are in beauty, skincare, cannabis, and supplements. If you're in a similar space and want a slot, now is the right time to reach out.",
    },
];

export default function CTA() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="relative bg-[#fafafa] py-24">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="max-w-2xl mx-auto text-left">
                    <h2 className="font-bold text-gray-900 leading-tight mb-12" style={{ fontSize: 'var(--text-h2)' }}>
                        Questions we hear
                        <span className="block font-bold text-gray-900 leading-tight" style={{ fontSize: 'var(--text-h2)' }}>
                            most often.
                        </span>
                    </h2>

                    <div className="space-y-4 mb-16 text-left">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className="pb-4 border-b border-gray-200 last:border-0"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenIndex(openIndex === index ? null : index)
                                    }
                                    className={`w-full text-left font-semibold transition-colors ${openIndex === index ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}
                                    style={{ fontSize: 'var(--text-h6)' }}
                                >
                                    {item.question}
                                </button>
                                {openIndex === index && (
                                    <p className="text-gray-600 leading-relaxed mt-3" style={{ fontSize: 'var(--text-sm)' }}>
                                        {item.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pricing anchor + scarcity signal */}
                    <div className="bg-gray-900 rounded-2xl px-8 py-8 mb-8">
                        <p className="text-white/50 uppercase tracking-[0.2em] font-semibold mb-2" style={{ fontSize: 'var(--text-xs)' }}>Projects start at</p>
                        <p className="text-white font-extrabold leading-none mb-1" style={{ fontSize: 'var(--text-h2)' }}>$10,000</p>
                        <p className="text-white/50 mt-3 mb-6 max-w-sm leading-relaxed" style={{ fontSize: 'var(--text-sm)' }}>
                            We take on a small number of projects at a time. If you're ready to talk, the first conversation is free.
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            Start a Project
                        </a>
                    </div>

                    <p className="text-gray-400 text-center" style={{ fontSize: 'var(--text-xs)' }}>
                        No commitment. No pitch. Just a conversation.
                    </p>
                </div>
            </div>
        </section>
    );
}
