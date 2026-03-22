import { motion } from 'framer-motion';
import { PulseDot } from '../ui/Button';

export default function Hero() {
    return (
        <section className="relative flex items-center overflow-hidden pt-48 pb-14 sm:pt-56 sm:pb-20">
            <div className="relative z-10 flex flex-col items-start justify-center text-left px-8 w-full max-w-4xl mx-auto" style={{ maxWidth: '56rem' }}>
                <motion.h1
                    className="font-extrabold leading-[1.05] tracking-tight mb-5 text-white"
                    style={{ fontSize: 'clamp(2rem, 5vw, var(--text-h1))' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                >
                    The product is the<br />
                    first impression.{' '}
                    <span className="text-accent">We build both.</span>
                </motion.h1>
                <motion.p
                    className="text-gray-300 font-medium max-w-[580px] mb-8 leading-relaxed text-left"
                    style={{ fontSize: 'var(--text-base)' }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.13, ease: 'easeOut' }}
                >
                    The gap between a product and a purchase is almost always visual. We close it — through 3D, motion, and the digital experiences built around them.
                </motion.p>
                <motion.div
                    className="flex items-center gap-3 flex-wrap justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.24, ease: 'easeOut' }}
                >
                    <a
                        href="#contact"
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold
                            transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                    >
                        <PulseDot />
                        Start a Project
                    </a>
                    <a
                        href="#services"
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-400 border border-gray-700
                            transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-gray-500"
                    >
                        See Our Work
                    </a>
                </motion.div>
            </div>

        </section>
    );
}
