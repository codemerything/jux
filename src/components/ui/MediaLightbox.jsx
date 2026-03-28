import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export function wrapCarouselIndex(index, total) {
    if (!total) {
        return 0;
    }

    return (index + total) % total;
}

function LightboxArrow({ direction = 'next', onClick }) {
    const isNext = direction === 'next';

    return (
        <button
            type="button"
            onClick={onClick}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/6 text-white/88 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:bg-white/12 sm:h-12 sm:w-12"
            aria-label={isNext ? 'Next slide' : 'Previous slide'}
        >
            <svg
                viewBox="0 0 20 20"
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isNext ? '' : 'rotate-180'}`}
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M7.5 4.5 13 10l-5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

function LightboxCloseButton({ onClick, className = '', label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/6 text-white/82 backdrop-blur-xl transition-all duration-300 hover:bg-white/12 sm:h-11 sm:w-11 ${className}`}
            aria-label={label}
        >
            <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" aria-hidden="true">
                <path
                    d="M5 5 15 15M15 5 5 15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </svg>
        </button>
    );
}

function MediaLightboxSlide({ slide, shouldPlay, shouldPreload = false }) {
    const videoRef = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        if (slide?.type !== 'video') {
            setIsVideoReady(false);
            return;
        }

        const video = videoRef.current;
        setIsVideoReady(Boolean(video && video.readyState >= 2));
    }, [slide]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || slide?.type !== 'video') {
            return;
        }

        if (shouldPlay) {
            const playPromise = video.play();
            if (playPromise?.catch) {
                playPromise.catch(() => {});
            }
            return;
        }

        video.pause();
    }, [shouldPlay, slide]);

    if (!slide) {
        return null;
    }

    return (
        <figure
            className="relative flex h-full w-auto items-center justify-center"
            style={{
                padding: 'clamp(4px, 0.7vw, 1.1rem)',
                width: 'fit-content',
                maxWidth: 'min(1400px, calc(100vw - 1rem))',
                maxHeight: '100%',
            }}
        >
            {slide.type === 'video' ? (
                <>
                    <div
                        className={`absolute inset-0 rounded-[6px] bg-black transition-opacity duration-300 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}
                        aria-hidden="true"
                    />
                    <video
                        ref={videoRef}
                        src={slide.src}
                        poster={slide.poster}
                        muted
                        loop
                        playsInline
                        preload={shouldPreload ? 'auto' : 'metadata'}
                        onLoadedData={() => setIsVideoReady(true)}
                        className={`block h-auto w-auto max-w-full rounded-[6px] object-contain select-none transition-opacity duration-300 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            maxHeight: '100%',
                        }}
                    />
                </>
            ) : (
                <img
                    src={slide.src}
                    alt={slide.alt ?? ''}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className="block h-auto w-auto max-w-full rounded-[6px] object-contain select-none"
                    style={{
                        maxHeight: '100%',
                    }}
                />
            )}
        </figure>
    );
}

export default function MediaLightbox({
    isOpen = false,
    slides = [],
    initialIndex = 0,
    onClose,
    title = 'Preview',
    closeLabel = 'Close preview',
    mobileHint = 'Swipe to browse',
    desktopHint = 'Swipe, scroll, or use the arrow keys.',
    renderInline = false,
    zIndexClassName = '',
    bounds = null,
    lockScroll = true,
    trapScroll = false,
    showTitle = true,
}) {
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
    const [activeIndex, setActiveIndex] = useState(0);
    const [visualIndex, setVisualIndex] = useState(1);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isTrackTransitionEnabled, setIsTrackTransitionEnabled] = useState(true);
    const [pendingDirection, setPendingDirection] = useState(0);
    const lightboxRef = useRef(null);
    const viewportRef = useRef(null);
    const preloadedImagesRef = useRef(new Set());
    const wheelNavigationLockRef = useRef(0);
    const wasOpenRef = useRef(false);
    const dragStateRef = useRef({
        active: false,
        pointerId: null,
        startX: 0,
    });

    const safeInitialIndex = wrapCarouselIndex(initialIndex, slides.length);
    const displayIndex = activeIndex;
    const windowedSlides = slides.length
        ? [-1, 0, 1].map(offset => {
            const slideIndex = wrapCarouselIndex(activeIndex + offset, slides.length);
            return {
                slide: slides[slideIndex],
                slideIndex,
            };
        })
        : [];

    const moveTrack = direction => {
        if (slides.length <= 1 || pendingDirection !== 0) {
            return;
        }

        setIsTrackTransitionEnabled(true);
        setPendingDirection(direction);
        setVisualIndex(direction > 0 ? 2 : 0);
    };

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            wasOpenRef.current = false;
            setDragOffset(0);
            setIsDragging(false);
            setIsTrackTransitionEnabled(true);
            setPendingDirection(0);
            setVisualIndex(1);
            dragStateRef.current = {
                active: false,
                pointerId: null,
                startX: 0,
            };
            return undefined;
        }

        if (!wasOpenRef.current) {
            setActiveIndex(safeInitialIndex);
            setIsTrackTransitionEnabled(false);
            setVisualIndex(1);
            setPendingDirection(0);
            wasOpenRef.current = true;
        }

        if (!lockScroll) {
            return undefined;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [isOpen, lockScroll, safeInitialIndex]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        if (typeof Image !== 'undefined' && slides.length) {
            [-1, 0, 1, 2].forEach(offset => {
                const preloadIndex = wrapCarouselIndex(activeIndex + offset, slides.length);
                const slide = slides[preloadIndex];

                if (!slide || slide.type === 'video' || preloadedImagesRef.current.has(slide.src)) {
                    return;
                }

                const image = new Image();
                image.decoding = 'async';
                image.src = slide.src;
                preloadedImagesRef.current.add(slide.src);
            });
        }

        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                onClose?.();
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveTrack(1);
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveTrack(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeIndex, isOpen, onClose, slides]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleWheel = event => {
            const overlay = lightboxRef.current;
            if (!overlay || !overlay.contains(event.target)) {
                return;
            }

            if (lockScroll || trapScroll) {
                event.preventDefault();
            }

            const now = performance.now();
            const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;

            if (Math.abs(horizontalIntent) < 18 || now - wheelNavigationLockRef.current < 420) {
                return;
            }

            wheelNavigationLockRef.current = now;
            moveTrack(horizontalIntent > 0 ? 1 : -1);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isOpen, lockScroll, pendingDirection, slides.length, trapScroll]);

    useEffect(() => {
        if (!isOpen || !trapScroll) {
            return undefined;
        }

        const overlay = lightboxRef.current;
        if (!overlay) {
            return undefined;
        }

        const preventTouchScroll = event => {
            event.preventDefault();
        };

        overlay.addEventListener('touchmove', preventTouchScroll, { passive: false });

        return () => {
            overlay.removeEventListener('touchmove', preventTouchScroll);
        };
    }, [isOpen, trapScroll]);

    useEffect(() => {
        if (isTrackTransitionEnabled) {
            return undefined;
        }

        const frameId = window.requestAnimationFrame(() => {
            setIsTrackTransitionEnabled(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isTrackTransitionEnabled]);

    const handlePointerDown = event => {
        if (slides.length <= 1 || pendingDirection !== 0) {
            return;
        }

        event.preventDefault();
        dragStateRef.current = {
            active: true,
            pointerId: event.pointerId,
            startX: event.clientX,
        };
        setIsDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = event => {
        const dragState = dragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        setDragOffset(event.clientX - dragState.startX);
    };

    const handlePointerRelease = event => {
        const dragState = dragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        const nextDragOffset = event.clientX - dragState.startX;
        const swipeThreshold = Math.min(140, viewportWidth * 0.12);

        if (nextDragOffset <= -swipeThreshold) {
            moveTrack(1);
        } else if (nextDragOffset >= swipeThreshold) {
            moveTrack(-1);
        }

        dragStateRef.current = {
            active: false,
            pointerId: null,
            startX: 0,
        };
        setDragOffset(0);
        setIsDragging(false);
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handleTrackTransitionEnd = () => {
        if (slides.length <= 1 || pendingDirection === 0) {
            return;
        }

        setActiveIndex(current => wrapCarouselIndex(current + pendingDirection, slides.length));
        setPendingDirection(0);
        setIsTrackTransitionEnabled(false);
        setVisualIndex(1);
    };

    const handleNext = () => {
        moveTrack(1);
    };

    const handlePrevious = () => {
        moveTrack(-1);
    };

    if (!isOpen || (!renderInline && typeof document === 'undefined')) {
        return null;
    }

    const lightboxContent = (
        <motion.div
            ref={lightboxRef}
            className={`${renderInline ? 'absolute inset-0' : bounds ? 'fixed overflow-hidden' : 'fixed inset-0 overflow-hidden'} ${zIndexClassName || (renderInline ? 'z-40' : 'z-[240]')}`}
            style={renderInline
                ? undefined
                : bounds
                    ? {
                        top: `${bounds.top}px`,
                        left: `${bounds.left}px`,
                        width: `${bounds.width}px`,
                        height: `${bounds.height}px`,
                        overscrollBehavior: 'none',
                    }
                    : {
                        overscrollBehavior: 'none',
                    }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.62 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                onClick={onClose}
            />

            <div
                ref={viewportRef}
                className={renderInline ? 'sticky top-0 h-screen' : 'h-full'}
            >
                <motion.div
                    className="relative z-10 flex h-full w-full flex-col justify-center overflow-hidden px-4 py-6 sm:px-6 lg:px-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.68, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/56">
                            {showTitle ? title : null}
                        </div>
                        <LightboxCloseButton onClick={onClose} className="hidden sm:flex" label={closeLabel} />
                    </div>

                    <div className="relative flex min-h-0 flex-1 items-center justify-center">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center lg:flex">
                            <LightboxArrow direction="previous" onClick={handlePrevious} />
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center lg:flex">
                            <LightboxArrow direction="next" onClick={handleNext} />
                        </div>

                        <div
                            className="relative h-full w-full overflow-hidden"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerRelease}
                            onPointerCancel={handlePointerRelease}
                            onLostPointerCapture={handlePointerRelease}
                            style={{
                                touchAction: 'none',
                                overscrollBehavior: 'none',
                            }}
                        >
                            <div
                                className="flex h-full"
                                onTransitionEnd={handleTrackTransitionEnd}
                                style={{
                                    transform: `translate3d(calc(${-visualIndex * 100}% + ${dragOffset}px), 0, 0)`,
                                    transition: isDragging || !isTrackTransitionEnabled
                                        ? 'none'
                                        : 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            >
                                {windowedSlides.map(({ slide, slideIndex }, index) => (
                                    <div
                                        key={slides.length > 2 ? `${slideIndex}` : `${slideIndex}-${index}`}
                                        className="flex h-full w-full shrink-0 items-center justify-center px-2 sm:px-8 lg:px-16"
                                    >
                                        <MediaLightboxSlide
                                            slide={slide}
                                            shouldPlay={index === 1 && pendingDirection === 0 && !isDragging}
                                            shouldPreload={slide?.type === 'video'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-center text-[12px] text-white/44 sm:text-left sm:text-sm">
                            <span className="sm:hidden">{mobileHint}</span>
                            <span className="hidden sm:inline">{desktopHint}</span>
                        </div>
                        <div className="relative flex w-full items-center justify-center sm:w-auto sm:justify-end">
                            <div className="flex items-center gap-2 lg:hidden">
                                <LightboxArrow direction="previous" onClick={handlePrevious} />
                                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/72">
                                    {String(displayIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                </div>
                                <LightboxArrow direction="next" onClick={handleNext} />
                            </div>
                            <LightboxCloseButton onClick={onClose} className="absolute right-0 sm:hidden" label={closeLabel} />
                            <div className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white/72 lg:block">
                                {String(displayIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );

    return renderInline ? lightboxContent : createPortal(lightboxContent, document.body);
}
