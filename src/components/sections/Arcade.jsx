import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const games = [
    {
        id: 'marrow-grow',
        name: 'Marrow Grow',
        tagline: 'A dark-fantasy pixel adventure. Grow your way through the dungeon.',
        url: 'https://marrowgrow-v2.vercel.app/',
    },
    {
        id: 'dookies-deckmate',
        name: 'Dookies Deckmate',
        tagline: 'Build your deck. Outsmart your opponent. Claim victory.',
        url: 'https://dookies-deckmate.vercel.app/',
    },
];

export default function Arcade() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const currentGame = games[currentIndex];

    // Snap-scroll: when section enters viewport, snap to it
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            },
            { threshold: [0.15] }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const goTo = (dir) => {
        setDirection(dir);
        setCurrentIndex((prev) => {
            const next = prev + dir;
            if (next < 0) return games.length - 1;
            if (next >= games.length) return 0;
            return next;
        });
    };

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <section
            ref={sectionRef}
            id="arcade"
            className="relative h-screen overflow-hidden flex flex-col"
            style={{ background: 'transparent' }}
        >
            <div className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto px-8 py-8">
                {/* Header row, compact */}
                <motion.div
                    className="flex items-end justify-between mb-4 shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-semibold">
                            Play Now
                        </p>
                        <h2 className="text-[32px] md:text-[44px] font-bold text-white leading-[1.1] tracking-tight">
                            Jux Arcade
                        </h2>
                    </div>

                    {/* Carousel controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goTo(-1)}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all hover:bg-white/5"
                            aria-label="Previous game"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button
                            onClick={() => goTo(1)}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all hover:bg-white/5"
                            aria-label="Next game"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </motion.div>

                {/* Game title row, compact */}
                <div className="mb-3 shrink-0 relative overflow-hidden" style={{ minHeight: '2.8rem' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentGame.id}
                            custom={direction}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            <h3 className="text-lg font-bold text-white">
                                {currentGame.name}
                            </h3>
                            <p className="text-white/40 text-xs">
                                {currentGame.tagline}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Game iframe, takes all remaining space */}
                <motion.div
                    className="relative flex-1 min-h-0"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentGame.id}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                className="absolute inset-0"
                            >
                                <iframe
                                    src={currentGame.url}
                                    title={`${currentGame.name} - Jux Arcade`}
                                    className="w-full h-full"
                                    style={{ border: 'none' }}
                                    allow="fullscreen; autoplay"
                                    loading="lazy"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Bottom bar, compact */}
                <div className="flex items-center justify-between mt-3 shrink-0">
                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                        {games.map((game, i) => (
                            <button
                                key={game.id}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex
                                        ? 'w-6 bg-white/60'
                                        : 'w-1.5 bg-white/15 hover:bg-white/30'
                                    }`}
                                aria-label={`Go to ${game.name}`}
                            />
                        ))}
                    </div>

                    <a
                        href={currentGame.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors"
                    >
                        Open Fullscreen ↗
                    </a>
                </div>
            </div>
        </section>
    );
}
