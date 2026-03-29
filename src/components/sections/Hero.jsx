import { motion } from 'framer-motion';
import { PulseDot } from '../ui/Button';
import SmartLink from '../ui/SmartLink';

function EyeIcon() {
    return (
        <svg viewBox="0 0 20 20" className="h-[1.1rem] w-[1.1rem]" fill="none" aria-hidden="true">
            <path
                d="M1.75 10s3.05-5 8.25-5 8.25 5 8.25 5-3.05 5-8.25 5-8.25-5-8.25-5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="10" cy="10" r="2.35" fill="currentColor" />
        </svg>
    );
}

export default function Hero({ onOpenPreview }) {
    return (
        <section className="relative flex items-center overflow-hidden pt-48 pb-8 sm:pt-56 sm:pb-12">
            <div className="relative z-10 flex flex-col items-start justify-center text-left px-8 w-full max-w-4xl mx-auto" style={{ maxWidth: '56rem' }}>
                <motion.h1
                    className="font-extrabold leading-[1.05] tracking-tight mb-5 text-white"
                    style={{ fontSize: 'clamp(1.5rem, 6.5vw, var(--text-h1))' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                >
                    When everything looks<br className="hidden sm:block" />{' '}
                    generated, <span className="whitespace-nowrap text-accent">make it human.</span>
                </motion.h1>
                <motion.p
                    className="text-gray-300 font-medium max-w-[580px] mb-8 leading-relaxed text-left"
                    style={{ fontSize: 'var(--text-base)', textWrap: 'pretty' }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.13, ease: 'easeOut' }}
                >
                    For the part of the project you can't prompt. We shape the interactive layers, micro-animation, and visual decisions that make a product or campaign feel real.
                </motion.p>
                <motion.div
                    className="flex w-full max-w-[26rem] items-stretch gap-2 justify-start sm:w-auto sm:max-w-none sm:gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.24, ease: 'easeOut' }}
                >
                    <SmartLink
                        href="/contact"
                        className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 bg-white text-black px-3 rounded-full text-[13px] font-semibold whitespace-nowrap
                            sm:flex-none sm:px-5 sm:text-sm
                            transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                    >
                        <PulseDot />
                        Start a Project
                    </SmartLink>
                    <button
                        type="button"
                        onClick={onOpenPreview}
                        aria-label="Open featured work gallery"
                        className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-full border border-gray-700 text-gray-400
                            sm:w-11 sm:flex-none sm:shrink-0
                            transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-500 hover:bg-white/5 hover:text-white"
                    >
                        <EyeIcon />
                    </button>
                </motion.div>
            </div>

        </section>
    );
}
