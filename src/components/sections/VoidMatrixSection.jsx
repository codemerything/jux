import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UnicornScene from '../ui/UnicornScene';
import VoidCard from '../ui/VoidCard';
import './VoidMatrix.css';

// Re-using the exact slide mapping from LaptopServices
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

export default function VoidMatrixSection() {
    const [activeService, setActiveService] = useState(0);
    const cardRefs = useRef([]);

    // Scroll mapping logic lifted exactly from Legacy LaptopServices
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
            if (frameId !== null) return;
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

    const slideKey = `laptop-slide-${activeService}`;

    return (
        <section id="void-matrix" className="void-matrix-bg relative pt-[150px] pb-[150px]">
            <div className="void-matrix-container layout-grid relative z-10 px-6 lg:px-0">
                
                {/* Left Column: Primary Interaction Cards */}
                <div className="cards-stack">
                    
                    {/* Card 1: Digital Infrastructure */}
                    <div ref={(el) => (cardRefs.current[0] = el)} style={{ scrollMarginTop: '7rem' }}>
                        <VoidCard
                            id="tilt-card-1"
                            title="Digital Infrastructure"
                            subtitle="CMS, assets, and deployment move through one stable operating layer."
                            statusText="System Live"
                            statusColor="red"
                            tag1="Schemas" tag2="Assets" tag3="Deploys"
                            footerTitle="Stop breaking the stack every time content changes."
                            footerDesc="We build the publishing and asset flow so launches, updates, and experiments stop creating technical debt."
                        >
                            <div className="visual-container">
                                <div className="grid-overlay"></div>
                                <svg className="network-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                                    <defs>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feMerge>
                                                <feMergeNode in="blur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                                            <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                                            <stop offset="100%" stopColor="rgba(255,0,0,0.8)" />
                                        </linearGradient>
                                    </defs>
                                    <path className="network-path secondary-path" d="M100,250 Q300,350 500,250 T700,150" fill="none" />
                                    <path className="network-path tertiary-path" d="M200,100 L600,300" fill="none" />
                                    <path className="network-path main-path" d="M100,200 Q250,100 400,200 T700,200" fill="none" />
                                    {/* Data Packet Core SVG Native Animation */}
                                    <circle r="4" fill="#ff0000" filter="url(#glow)">
                                        <animateMotion dur="4s" repeatCount="indefinite" path="M100,200 Q250,100 400,200 T700,200" />
                                        <animate attributeName="opacity" values="0; 0.8; 0.8; 0" keyTimes="0; 0.15; 0.85; 1" dur="4s" repeatCount="indefinite" />
                                    </circle>
                                    
                                    <g className="nodes">
                                        <circle cx="100" cy="200" r="3" className="node" />
                                        <circle cx="400" cy="200" r="5" className="node active-node" filter="url(#glow)" />
                                        <circle cx="700" cy="200" r="3" className="node" />
                                        <circle cx="250" cy="120" r="2" className="node dim-node" />
                                        <circle cx="550" cy="280" r="4" className="node active-node red-node" filter="url(#glow)" />
                                    </g>
                                    <line className="scan-line" x1="0" x2="800" y1="0" y2="0" />
                                </svg>
                                <div className="data-label top-label">
                                    <span className="label-dot"></span>
                                    <span className="label-text dot-matrix">Operational</span>
                                </div>
                                <div className="version-label dot-matrix">Matrix_v4.0.1</div>
                            </div>
                        </VoidCard>
                    </div>

                    {/* Card 2: Creative Direction */}
                    <div ref={(el) => (cardRefs.current[1] = el)} style={{ scrollMarginTop: '7rem' }}>
                        <VoidCard
                            id="tilt-card-2"
                            title={<>Creative<br/>Direction</>}
                            subtitle="Reference drift gets tightened into a clear visual direction and execution track."
                            statusText="Strategic Orbit"
                            statusColor="amber"
                            tag1="Moodboard" tag2="Rules" tag3="Plan"
                            footerTitle="You know the work is off, but not why yet."
                            footerDesc="This is the strategy pass that turns scattered feedback into a clear visual direction, system, and execution plan."
                        >
                            <div className="visual-container">
                                <div className="grid-overlay"></div>
                                <svg className="orbit-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                                    <defs>
                                        <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur-amber" />
                                            <feMerge>
                                                <feMergeNode in="blur-amber" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                        <filter id="aura-amber" x="-100%" y="-100%" width="300%" height="300%">
                                            <feGaussianBlur stdDeviation="12" result="blur" />
                                        </filter>
                                    </defs>
                                    <circle cx="400" cy="200" r="80" fill="none" className="orbit-path" />
                                    <circle cx="400" cy="200" r="140" fill="none" className="orbit-path default-dash" />
                                    <circle cx="400" cy="200" r="200" fill="none" className="orbit-path faint-dash" />
                                    <g className="orbit-system">
                                        <circle cx="400" cy="200" r="16" fill="var(--accent-amber)" filter="url(#aura-amber)" className="core-aura pulse-slow" />
                                        <circle cx="400" cy="200" r="13" fill="var(--accent-amber)" className="core-node" />
                                        <g className="orbit-ring ring-1"><circle cx="480" cy="200" r="5" fill="#fff" opacity="0.8" /></g>
                                        <g className="orbit-ring ring-2"><circle cx="260" cy="200" r="7" fill="var(--accent-amber)" filter="url(#glow-amber)" /><circle cx="500" cy="299" r="4" fill="#fff" opacity="0.6" /></g>
                                        <g className="orbit-ring ring-3"><circle cx="200" cy="200" r="9" fill="#fff" opacity="0.9" filter="url(#glow)" /></g>
                                    </g>
                                    <line className="scan-line" x1="0" x2="800" y1="0" y2="0" />
                                </svg>
                                <div className="data-label top-label border-amber">
                                    <span className="label-dot bg-amber pulse-opacity"></span>
                                    <span className="label-text dot-matrix text-amber">Aligning</span>
                                </div>
                                <div className="version-label dot-matrix">Strategy_v2.1</div>
                            </div>
                        </VoidCard>
                    </div>

                    {/* Card 3: Interactive Experiences */}
                    <div ref={(el) => (cardRefs.current[2] = el)} style={{ scrollMarginTop: '7rem' }}>
                        <VoidCard
                            id="tilt-card-3"
                            title={<>Interactive<br/>Experiences</>}
                            subtitle="Interfaces that answer product questions before the customer needs support."
                            statusText="Live Render"
                            statusColor="cyan"
                            tag1="Hotspots" tag2="3D UI" tag3="Motion"
                            footerTitle="Let customers interact before they commit."
                            footerDesc="Use 3D, configurators, and guided product views to answer questions earlier and raise buying confidence."
                        >
                            <div className="visual-container">
                                <div className="grid-overlay"></div>
                                <div className="interactive-scene">
                                    <div className="stacked-cards">
                                        <div className="pixel-mouse">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M5,2 l14,8 l-6,2 l4,8 l-3,1 l-4,-8 l-4,4 z" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="1.5" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="stack-card card-1"><div className="card-ui"><div className="card-ui-line"></div><div className="card-ui-line short"></div></div></div>
                                        <div className="stack-card card-2"><div className="card-ui"><div className="card-ui-line"></div><div className="card-ui-line short"></div></div></div>
                                        <div className="stack-card card-3"><div className="card-ui"><div className="card-ui-line"></div><div className="card-ui-line short"></div></div></div>
                                        <div className="stack-card card-4"><div className="card-ui"><div className="card-ui-line"></div><div className="card-ui-line short"></div></div></div>
                                        <div className="stack-card card-5"><div className="card-ui"><div className="card-ui-line"></div><div className="card-ui-line short"></div></div></div>
                                    </div>
                                </div>
                                <div className="data-label top-label border-cyan">
                                    <span className="label-dot bg-cyan pulse-opacity"></span>
                                    <span className="label-text dot-matrix text-cyan">Rendering</span>
                                </div>
                                <div className="version-label dot-matrix">Sandbox_v1.4</div>
                            </div>
                        </VoidCard>
                    </div>

                    {/* Card 4: Brand Visual Systems */}
                    <div ref={(el) => (cardRefs.current[3] = el)} style={{ scrollMarginTop: '7rem' }}>
                        <VoidCard
                            id="tilt-card-4"
                            title={<>Brand Visual<br/>Systems</>}
                            subtitle="A modular brand language that holds together across launches, decks, and campaigns."
                            statusText="System Sync"
                            statusColor="violet"
                            tag1="Type" tag2="Tokens" tag3="Kits"
                            footerTitle="Make every brand touchpoint feel like the same company."
                            footerDesc="We turn visual decisions into a repeatable system so site, campaigns, decks, and launches stay aligned."
                        >
                            <div className="visual-container">
                                <div className="grid-overlay"></div>
                                <div className="brand-sandbox">
                                    <div className="brand-module type-module">
                                       <div className="module-label">Headline</div>
                                       <div className="dynamic-type">Aa</div>
                                    </div>
                                    <div className="brand-module color-module">
                                       <div className="module-label">Primary</div>
                                       <div className="token-row">
                                         <div className="token-dot dynamic-bg"></div>
                                         <div className="token-hex dynamic-hex"></div>
                                       </div>
                                    </div>
                                    <div className="brand-module ui-module">
                                       <div className="module-label">Tertiary</div>
                                       <div className="token-row">
                                         <div className="token-dot dynamic-bg-alt"></div>
                                         <div className="token-hex dynamic-hex-alt"></div>
                                       </div>
                                    </div>
                                    <div className="brand-slider-container">
                                       <div className="slider-track">
                                          <div className="slider-thumb"></div>
                                       </div>
                                    </div>
                                </div>
                                <div className="data-label top-label border-violet">
                                    <span className="label-dot bg-violet pulse-opacity"></span>
                                    <span className="label-text dot-matrix text-violet">Interpolating</span>
                                </div>
                            </div>
                        </VoidCard>
                    </div>
                </div>

                {/* Right Column: Sticky Laptop Interface wired to AnimatePresence */}
                <aside className="laptop-container">
                    <div className="laptop-sticky-wrapper">
                        <div className="laptop-frame">
                            <div className="laptop-screen">
                                <div className="screen-content">
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
                                                <img src={laptopWideSlides.wideslide1} alt="" className="h-auto w-full self-start" />
                                            ) : activeService === 1 && laptopWideSlides.wideslide2 ? (
                                                <img src={laptopWideSlides.wideslide2} alt="" className="h-full w-auto max-w-none" />
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
                                                <img src={laptopWideSlides.wideslide4} alt="" className="h-auto w-full self-start" />
                                            ) : (
                                                <div className="p-8 text-center transition-all duration-500">
                                                    <div className="laptop-glow"></div>
                                                    <div className="laptop-message dot-matrix text-cyan">Awaiting Signal...</div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="laptop-base"></div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
