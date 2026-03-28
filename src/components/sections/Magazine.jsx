import { useState, useEffect, useRef } from 'react';
import SmartLink from '../ui/SmartLink';

export default function Magazine() {
    const [currentPage, setCurrentPage] = useState(0);
    const sectionRef = useRef(null);
    const totalPages = 3;

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(scrolled / (sectionHeight - window.innerHeight), 1));
            const page = Math.floor(progress * totalPages);
            setCurrentPage(Math.min(page, totalPages - 1));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="magazine" ref={sectionRef} className="relative h-[400vh] bg-[#fafafa]">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-linear-to-b from-[#f5f5f0] via-[#fafafa] to-[#f5f5f0]" />

                <div className="relative perspective-[2000px]">
                    {/* Magazine Container */}
                    <div className="relative w-[700px] max-w-[90vw] aspect-3/4">
                        {/* Spine */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 z-30 shadow-lg" />

                        {/* Left page stack (decorative) */}
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gray-200 -translate-x-2" />
                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-100 -translate-x-4" />

                        {/* Right page stack (decorative) */}
                        <div className="absolute right-0 top-2 bottom-2 w-1 bg-gray-200 translate-x-2" />
                        <div className="absolute right-0 top-4 bottom-4 w-1 bg-gray-100 translate-x-4" />

                        {/* Pages */}
                        {[0, 1, 2].map((pageIndex) => (
                            <div
                                key={pageIndex}
                                className="absolute inset-0 transition-all duration-700 ease-out origin-center"
                                style={{
                                    transform: `rotateY(${(pageIndex - currentPage) * -30}deg) translateZ(${pageIndex === currentPage ? 50 : -50}px)`,
                                    opacity: Math.abs(pageIndex - currentPage) > 1 ? 0 : 1,
                                    zIndex: totalPages - Math.abs(pageIndex - currentPage)
                                }}
                            >
                                {/* Two-page spread */}
                                <div className="absolute inset-0 grid grid-cols-2 shadow-2xl">
                                    {/* Left Page */}
                                    <div className="relative bg-white border-r border-gray-100 overflow-hidden">
                                        <PageContent pageIndex={pageIndex} side="left" />
                                    </div>

                                    {/* Right Page */}
                                    <div className="relative bg-white overflow-hidden">
                                        <PageContent pageIndex={pageIndex} side="right" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Page indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-accent w-6' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PageContent({ pageIndex, side }) {
    // Page 0: Cover & Editorial
    if (pageIndex === 0) {
        if (side === 'left') {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-linear-to-br from-white to-gray-50">
                    <div className="mb-6">
                        <div className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">SPRING / SUMMER 2026</div>
                        <div className="text-[10px] tracking-[0.2em] text-gray-300">ISSUE 01</div>
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl leading-[0.85] text-gray-900 mb-8">
                        JUX<br />STUDIO
                    </h1>
                    <div className="w-32 h-40 bg-linear-to-br from-accent to-purple-600 rounded-lg neon-glow-indigo" />
                    <div className="mt-auto pt-8 text-[10px] tracking-[0.2em] text-gray-400">
                        LONDON • TOKYO • NYC
                    </div>
                </div>
            );
        } else {
            return (
                <div className="absolute inset-0 flex flex-col p-8">
                    <div className="mb-6">
                        <div className="text-[10px] tracking-[0.3em] text-accent mb-2">MANIFESTO</div>
                        <h2 className="font-display text-3xl text-gray-900">The Art of<br />Digital Tension</h2>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                        <span className="float-left text-4xl font-display text-accent mr-3 leading-none">W</span>
                        e believe design is a conversation between the user and the void. It is the friction that creates emotion, the tension that drives interaction. In an age of automation, we find soul in the machine through meticulous craft and atmospheric precision.
                    </div>
                    <div className="mt-auto text-xs text-gray-300">02</div>
                </div>
            );
        }
    }

    // Page 1: Case Study & Strategy
    if (pageIndex === 1) {
        if (side === 'left') {
            return (
                <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-white flex items-center justify-center p-8">
                    <div className="absolute top-8 left-8">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-accent border border-accent px-3 py-1">
                            CASE STUDY
                        </span>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl text-gray-900 leading-[0.9]">
                        THE<br />OBSIDIAN<br />VOID
                    </h3>
                </div>
            );
        } else {
            return (
                <div className="absolute inset-0 flex flex-col p-8">
                    <div className="mb-6">
                        <div className="text-[10px] tracking-[0.3em] text-accent mb-2">STRATEGY</div>
                        <h2 className="font-display text-2xl text-gray-900">Architecting<br />Silent Growth</h2>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Design is not just what it looks like. It's how it moves, how it feels, and how it performs under pressure.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-accent">85%</div>
                            <div className="text-[10px] text-gray-400">CONVERSION INCREASE</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-accent">2.4x</div>
                            <div className="text-[10px] text-gray-400">LTV GROWTH</div>
                        </div>
                    </div>
                    <div className="mt-auto text-xs text-gray-300">04</div>
                </div>
            );
        }
    }

    // Page 2: Capabilities & Back Cover
    if (pageIndex === 2) {
        if (side === 'left') {
            return (
                <div className="absolute inset-0 flex flex-col p-8 bg-white">
                    <div className="mb-6">
                        <div className="text-[10px] tracking-[0.2em] text-accent font-bold mb-2">CAPABILITIES</div>
                        <h2 className="font-display text-3xl text-gray-900">CORE<br />SYSTEMS</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {[
                            { title: 'MOTION GLASS', desc: 'Physics-based UI that reacts to human touch.' },
                            { title: 'DARK UX', desc: 'Aesthetics for high-end immersion.' },
                            { title: 'STRATEGY', desc: 'Turning identity into market dominance.' },
                            { title: 'LIFECYCLE', desc: 'Continuous evolution for growth.' }
                        ].map((item, i) => (
                            <div key={i} className={`p-4 ${i < 2 ? 'bg-accent/10 border border-accent/20' : 'border border-gray-100'} rounded-lg`}>
                                <h4 className="text-[10px] font-bold mb-2 text-gray-900">{item.title}</h4>
                                <p className="text-[10px] text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto text-xs text-gray-300">05</div>
                </div>
            );
        } else {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-900 text-white">
                    <div className="text-[10px] tracking-[0.5em] text-white/30 mb-12">JUX STUDIO • 2026</div>
                    <div className="font-display text-4xl text-white mb-10">FIN.</div>
                    <p className="text-sm text-white/50 mb-8">Join the standard of digital excellence.</p>
                    <SmartLink
                        href="/contact"
                        className="bg-white text-gray-900 px-10 py-4 font-bold text-[11px] tracking-[0.1em] hover:bg-gray-100 transition-colors rounded-full"
                    >
                        START A PROJECT
                    </SmartLink>
                    <div className="mt-auto text-xs text-white/20">ISSUE 01 / END</div>
                </div>
            );
        }
    }

    return null;
}
