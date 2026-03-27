import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const ringCards = Object.entries(
    import.meta.glob('../../../heroImages/*.{webp,png,jpg,jpeg,avif}', {
        eager: true,
        import: 'default',
    })
)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([path, src]) => ({
        fileName: path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? path,
        src,
    }));

const mobileLightboxCardSources = new Map(
    Object.entries(
        import.meta.glob('../../../heroImages/mobile/*-mobile.webp', {
            eager: true,
            import: 'default',
        })
    ).map(([path, src]) => [
        path.split('/').pop()?.replace(/-mobile\.webp$/, '') ?? path,
        src,
    ])
);

const MARQUEE_CARD_ORDER = [
    '9slJRiUdX60eHMiQLI6Tf2AnWMU',
    'ahzChqmXkvjgw1OjVCmmejV1s',
    '1',
    'qFdogfcA55X0fvnIj1bHUa9obg',
    '1.1',
    'KcUjqrwClJ7a1KDTpEofNVleg',
    '1.5diamonds1',
    'LmK9SwBD5YaCi8DkyxMrDclx1xU',
    '23',
    '1.7',
];

const marqueeCardSet = MARQUEE_CARD_ORDER
    .map(fileName => ringCards.find(card => card.fileName === fileName))
    .filter(Boolean)
    .map(card => card.src);

const lightboxCardSet = ringCards.map(card => ({
    src: card.src,
    mobileSrc: mobileLightboxCardSources.get(card.fileName) ?? card.src,
}));

const TAU = Math.PI * 2;
const MOBILE_DRAG_ROTATION_FACTOR = 0.0085;
const DESKTOP_DRAG_ROTATION_FACTOR = 0.0048;
const MOBILE_INERTIA_DAMPING = 0.92;
const MOBILE_INERTIA_MIN_VELOCITY = 0.00008;

const normalizeRotation = value => {
    const normalized = value % TAU;
    return normalized < 0 ? normalized + TAU : normalized;
};

const getShortestAngleDistance = angle => {
    const normalized = ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
    return Math.abs(normalized);
};

const getFrontCardIndex = (total, rotation) => {
    if (!total) {
        return 0;
    }

    let frontCardIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < total; index += 1) {
        const angle = rotation + (index / total) * TAU;
        const distance = getShortestAngleDistance(angle);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            frontCardIndex = index;
        }
    }

    return frontCardIndex;
};

const VIEWPORTS = {
    mobile: {
        cardCount: 5,
        cardWidth: 150,
        cardHeight: 209,
        orbitRadiusX: 142,
        orbitRadiusY: 32,
        angleJitterMain: 0.016,
        angleJitterSecondary: 0.006,
        angleJitterTertiary: 0.004,
        radiusJitterMain: 6,
        radiusJitterSecondary: 3,
        liftJitter: 4.5,
        tiltJitterMain: 0.9,
        tiltJitterSecondary: 0.35,
        sideSpread: 4.75,
        yOffset: 22,
        depthLift: 4,
        scaleBase: 0.86,
        scaleRange: 0.12,
        frontPullbackScale: 0.018,
        rotateAmplitude: 8,
        rotateBackTilt: -1.2,
        fullOpacityThreshold: 0.7,
        opacityMin: 0.58,
        blurMax: 0.6,
        shadowBase: 0.14,
        shadowRange: 0.1,
        shadowPullback: 0.03,
        stageHeight: 340,
        stageMaxWidth: 560,
        cardTop: '48%',
        guideTop: '56%',
        guideWidth: 327,
        guideHeight: 119,
        glowWidth: '84%',
        glowHeight: 44,
        glowBottom: 54,
        overlayHeight: '61%',
        overlayBaseFillHeight: '26%',
        overlayWidth: '182%',
        overlayGradient:
            'radial-gradient(176% 88% at 50% 108%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 23%, rgba(0,0,0,0.9) 39%, rgba(0,0,0,0.58) 52%, rgba(0,0,0,0.24) 62%, rgba(0,0,0,0) 72%)',
        speed: 0.000084,
    },
    tablet: {
        cardCount: 6,
        cardWidth: 214,
        cardHeight: 298,
        orbitRadiusX: 340,
        orbitRadiusY: 70,
        angleJitterMain: 0.017,
        angleJitterSecondary: 0.0065,
        angleJitterTertiary: 0.0045,
        radiusJitterMain: 10,
        radiusJitterSecondary: 5,
        liftJitter: 6,
        tiltJitterMain: 1.1,
        tiltJitterSecondary: 0.45,
        sideSpread: 9,
        yOffset: 23,
        depthLift: 6,
        scaleBase: 0.83,
        scaleRange: 0.17,
        frontPullbackScale: 0.025,
        rotateAmplitude: 10,
        rotateBackTilt: -1.5,
        fullOpacityThreshold: 0.68,
        opacityMin: 0.48,
        blurMax: 0.9,
        shadowBase: 0.16,
        shadowRange: 0.14,
        shadowPullback: 0.04,
        stageHeight: 540,
        stageMaxWidth: 980,
        cardTop: '46%',
        guideTop: '51%',
        guideWidth: 920,
        guideHeight: 260,
        glowWidth: '76%',
        glowHeight: 56,
        glowBottom: 72,
        overlayHeight: '66%',
        overlayBaseFillHeight: '22%',
        overlayWidth: '156%',
        overlayGradient:
            'radial-gradient(180% 96% at 50% 108%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.99) 23%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.62) 54%, rgba(0,0,0,0.24) 64%, rgba(0,0,0,0) 76%)',
        speed: 0.000112,
    },
    desktop: {
        cardCount: 8,
        cardWidth: 286,
        cardHeight: 398,
        orbitRadiusX: 459,
        orbitRadiusY: 92,
        angleJitterMain: 0.018,
        angleJitterSecondary: 0.007,
        angleJitterTertiary: 0.005,
        radiusJitterMain: 14,
        radiusJitterSecondary: 7,
        liftJitter: 8,
        tiltJitterMain: 1.5,
        tiltJitterSecondary: 0.6,
        sideSpread: 12,
        yOffset: 24,
        depthLift: 8,
        scaleBase: 0.8,
        scaleRange: 0.2,
        frontPullbackScale: 0.035,
        rotateAmplitude: 12,
        rotateBackTilt: -1.8,
        fullOpacityThreshold: 0.66,
        opacityMin: 0.4,
        blurMax: 1.15,
        shadowBase: 0.18,
        shadowRange: 0.18,
        shadowPullback: 0.05,
        stageHeight: 720,
        stageMaxWidth: 1680,
        cardTop: '43%',
        guideTop: '47%',
        guideWidth: 1380,
        guideHeight: 384,
        glowWidth: '70%',
        glowHeight: 64,
        glowBottom: 96,
        overlayHeight: '73%',
        overlayBaseFillHeight: '19%',
        overlayWidth: '144%',
        overlayGradient:
            'radial-gradient(182% 102% at 50% 107%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.995) 24%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.64) 53%, rgba(0,0,0,0.24) 63%, rgba(0,0,0,0) 73%)',
        speed: 0.00014,
    },
};

function getViewportConfig(width) {
    if (width < 768) {
        return VIEWPORTS.mobile;
    }

    if (width < 1024) {
        return VIEWPORTS.tablet;
    }

    return VIEWPORTS.desktop;
}

function OrbitCard({ src, index, total, rotation, config, isDragging }) {
    const seed = index / total;
    const baseAngle = rotation + seed * TAU;
    const angleOffset =
        Math.sin(seed * TAU * 1.75 + 0.35) * config.angleJitterMain +
        Math.sin(seed * TAU * 3.1 - 0.8) * config.angleJitterSecondary +
        Math.cos(seed * TAU * 2.35 + 0.5) * config.angleJitterTertiary;
    const radiusOffset =
        Math.sin(seed * TAU * 1.4 - 0.4) * config.radiusJitterMain +
        Math.cos(seed * TAU * 2.2 + 0.9) * config.radiusJitterSecondary;
    const liftOffset = Math.sin(seed * TAU * 2.1 + 0.6) * config.liftJitter;
    const tiltOffset =
        Math.sin(seed * TAU * 1.8 - 0.2) * config.tiltJitterMain +
        Math.cos(seed * TAU * 3.2 + 0.4) * config.tiltJitterSecondary;
    const angle = baseAngle + angleOffset;
    const depth = (Math.cos(angle) + 1) / 2;
    const frontFocus = Math.max(0, Math.cos(angle));
    const frontPullback = Math.pow(frontFocus, 4);
    const sideSpread = Math.pow(Math.abs(Math.sin(angle)), 1.04) * config.sideSpread;
    const x = Math.sin(angle) * (config.orbitRadiusX + radiusOffset + sideSpread);
    const y =
        -Math.cos(angle) * (config.orbitRadiusY + liftOffset * 0.3) +
        config.yOffset +
        depth * config.depthLift +
        liftOffset * 0.35;
    const scale = config.scaleBase + depth * config.scaleRange - frontPullback * config.frontPullbackScale;
    const rotate = Math.sin(angle) * config.rotateAmplitude + Math.cos(angle) * config.rotateBackTilt + tiltOffset;
    const hoverTilt = Math.max(-1.35, Math.min(1.35, rotate * 0.12));
    const frontOpacity =
        depth > config.fullOpacityThreshold
            ? 1
            : config.opacityMin + (depth / config.fullOpacityThreshold) * (1 - config.opacityMin);
    const opacity = Math.min(1, frontOpacity);
    const blur = (1 - depth) * config.blurMax;
    const shadowOpacity = config.shadowBase + depth * config.shadowRange - frontPullback * config.shadowPullback;
    const zIndex = Math.round(depth * 100);

    return (
        <div
            className="pointer-events-none absolute left-1/2"
            style={{
                top: config.cardTop,
                width: `${config.cardWidth}px`,
                height: `${config.cardHeight}px`,
                zIndex,
                opacity,
                filter: `blur(${blur}px)`,
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                transformOrigin: 'center center',
            }}
        >
            <motion.div
                className="relative isolate h-full w-full rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_18%,rgba(255,255,255,0.06)_52%,rgba(255,255,255,0.16)_100%)] p-px"
                animate={isDragging ? { scale: 1.002 } : { scale: 1 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    boxShadow: `0 36px 96px rgba(0,0,0,${Math.min(0.52, shadowOpacity + 0.08)}), 0 14px 34px rgba(0,0,0,${Math.max(
                        0.16,
                        shadowOpacity * 0.62
                    )})`,
                }}
            >
                <div
                    className="relative h-full w-full overflow-hidden bg-black"
                    style={{
                        borderRadius: 'calc(1.45rem - 1px)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.03)',
                    }}
                >
                    <div className="absolute inset-0 bg-black/80" />
                    <img
                        src={src}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="relative z-10 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_18%,transparent_44%,transparent_100%)]" />
                </div>
            </motion.div>
        </div>
    );
}

function wrapCarouselIndex(index, total) {
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
            aria-label={isNext ? 'Next image' : 'Previous image'}
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

function LightboxCloseButton({ onClick, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/6 text-white/82 backdrop-blur-xl transition-all duration-300 hover:bg-white/12 sm:h-11 sm:w-11 ${className}`}
            aria-label="Close featured work gallery"
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

function HeroLightbox({
    cards,
    displayIndex,
    activeIndex,
    visualIndex,
    dragOffset,
    isDragging,
    isTrackTransitionEnabled,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onTrackTransitionEnd,
    onClose,
    onNext,
    onPrevious,
}) {
    const windowedCards = cards.length
        ? [
            cards[wrapCarouselIndex(activeIndex - 1, cards.length)],
            cards[wrapCarouselIndex(activeIndex, cards.length)],
            cards[wrapCarouselIndex(activeIndex + 1, cards.length)],
        ]
        : cards;

    return (
        <motion.div
            className="fixed inset-0 z-[240] flex items-center justify-center"
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

            <motion.div
                className="pointer-events-none absolute inset-0 opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.72, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.03) 28%, rgba(0,0,0,0) 62%)`,
                }}
            />

            <motion.div
                className="relative z-10 flex h-screen w-screen flex-col justify-center overflow-hidden px-4 py-6 sm:px-6 lg:px-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.68, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/56">
                        Featured Work
                    </div>
                    <LightboxCloseButton onClick={onClose} className="hidden sm:flex" />
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center lg:flex">
                        <LightboxArrow direction="previous" onClick={onPrevious} />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center lg:flex">
                        <LightboxArrow direction="next" onClick={onNext} />
                    </div>

                    <div
                        className="relative h-full w-full overflow-hidden"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
                        onLostPointerCapture={onPointerCancel}
                        style={{
                            touchAction: 'none',
                            overscrollBehavior: 'none',
                        }}
                    >
                        <div
                            className="flex h-full"
                            onTransitionEnd={onTrackTransitionEnd}
                            style={{
                                transform: `translate3d(calc(${-visualIndex * 100}% + ${dragOffset}px), 0, 0)`,
                                transition: isDragging || !isTrackTransitionEnabled
                                    ? 'none'
                                    : 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            {windowedCards.map((src, index) => (
                                <div
                                    key={`${src}-${index}`}
                                    className="flex h-full w-full shrink-0 items-center justify-center px-2 sm:px-8 lg:px-16"
                                >
                                    <figure
                                        className="relative flex w-auto items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-[0_32px_110px_rgba(0,0,0,0.52)] backdrop-blur-sm"
                                        style={{
                                            padding: 'clamp(4px, 0.7vw, 1.1rem)',
                                            width: 'fit-content',
                                            maxWidth: 'min(1400px, calc(100vw - 1rem))',
                                            maxHeight: '82vh',
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            draggable={false}
                                            className="block h-auto w-auto max-w-full rounded-[22px] object-contain select-none"
                                            style={{
                                                maxHeight: 'calc(82vh - clamp(8px, 1.4vw, 2.2rem))',
                                            }}
                                        />
                                        <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/7" />
                                        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-white/10" />
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center text-[12px] text-white/44 sm:text-left sm:text-sm">
                        <span className="sm:hidden">Swipe to browse</span>
                        <span className="hidden sm:inline">Swipe, scroll, or use the arrow keys.</span>
                    </div>
                    <div className="relative flex w-full items-center justify-center sm:w-auto sm:justify-end">
                        <div className="flex items-center gap-2 lg:hidden">
                            <LightboxArrow direction="previous" onClick={onPrevious} />
                            <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/72">
                                {String(displayIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
                            </div>
                            <LightboxArrow direction="next" onClick={onNext} />
                        </div>
                        <LightboxCloseButton onClick={onClose} className="absolute right-0 sm:hidden" />
                        <div className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white/72 lg:block">
                            {String(displayIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Marquee({ className = '', isPreviewOpen = false, onClosePreview }) {
    const [rotation, setRotation] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
    const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);
    const [lightboxVisualIndex, setLightboxVisualIndex] = useState(1);
    const [lightboxDragOffset, setLightboxDragOffset] = useState(0);
    const [isLightboxDragging, setIsLightboxDragging] = useState(false);
    const [isLightboxTrackTransitionEnabled, setIsLightboxTrackTransitionEnabled] = useState(true);
    const [lightboxPendingDirection, setLightboxPendingDirection] = useState(0);
    const stageRef = useRef(null);
    const frameRef = useRef(null);
    const lastTimeRef = useRef(null);
    const rotationRef = useRef(0);
    const lightboxViewportRef = useRef(null);
    const wheelNavigationLockRef = useRef(0);
    const lightboxDragStateRef = useRef({
        active: false,
        pointerId: null,
        startX: 0,
    });
    const dragStateRef = useRef({
        active: false,
        pointerId: null,
        startX: 0,
        startRotation: 0,
        lastX: 0,
        lastTime: 0,
    });
    const inertiaVelocityRef = useRef(0);
    const pauseAutoRotateUntilRef = useRef(0);
    const config = getViewportConfig(viewportWidth);
    const cards = marqueeCardSet.slice(0, config.cardCount);
    const lightboxCards = lightboxCardSet.map(card => (isTouchCarousel ? card.mobileSrc : card.src));
    const isTouchCarousel = viewportWidth < 768;
    const lightboxDisplayIndex = lightboxActiveIndex;
    const isOrbitDragging = dragStateRef.current.active;
    const orbitDragRotationFactor = isTouchCarousel ? MOBILE_DRAG_ROTATION_FACTOR : DESKTOP_DRAG_ROTATION_FACTOR;
    const orbitInertiaBlend = isTouchCarousel ? 0.7 : 0.45;

    const moveLightboxTrack = direction => {
        if (lightboxCards.length <= 1 || lightboxPendingDirection !== 0) {
            return;
        }

        setIsLightboxTrackTransitionEnabled(true);
        setLightboxPendingDirection(direction);
        setLightboxVisualIndex(direction > 0 ? 2 : 0);
    };

    const handleLightboxNext = () => {
        moveLightboxTrack(1);
    };

    const handleLightboxPrevious = () => {
        moveLightboxTrack(-1);
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
        lastTimeRef.current = null;

        const animate = now => {
            if (lastTimeRef.current === null) {
                lastTimeRef.current = now;
            }

            if (dragStateRef.current.active || now < pauseAutoRotateUntilRef.current) {
                const delta = Math.min(now - lastTimeRef.current, 32);
                lastTimeRef.current = now;

                if (!dragStateRef.current.active && Math.abs(inertiaVelocityRef.current) > MOBILE_INERTIA_MIN_VELOCITY) {
                    const nextRotation = normalizeRotation(
                        rotationRef.current + inertiaVelocityRef.current * delta
                    );

                    inertiaVelocityRef.current *= Math.pow(MOBILE_INERTIA_DAMPING, delta / 16);
                    rotationRef.current = nextRotation;
                    setRotation(nextRotation);
                } else if (!dragStateRef.current.active) {
                    inertiaVelocityRef.current = 0;
                }

                frameRef.current = window.requestAnimationFrame(animate);
                return;
            }

            const delta = Math.min(now - lastTimeRef.current, 32);
            lastTimeRef.current = now;

            setRotation(previous => {
                const nextRotation = normalizeRotation(previous + delta * config.speed);
                rotationRef.current = nextRotation;
                return nextRotation;
            });
            frameRef.current = window.requestAnimationFrame(animate);
        };

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [config.speed]);

    useLayoutEffect(() => {
        if (!isPreviewOpen) {
            setLightboxDragOffset(0);
            setIsLightboxDragging(false);
            setIsLightboxTrackTransitionEnabled(true);
            setLightboxPendingDirection(0);
            setLightboxVisualIndex(1);
            lightboxDragStateRef.current = {
                active: false,
                pointerId: null,
                startX: 0,
            };
            return;
        }

        setIsLightboxTrackTransitionEnabled(false);
        const frontCarouselIndex = getFrontCardIndex(cards.length, rotationRef.current);
        const frontCarouselSrc = cards[frontCarouselIndex];
        const lightboxStartIndex = Math.max(0, lightboxCardSet.findIndex(card => card.src === frontCarouselSrc));

        setLightboxActiveIndex(lightboxStartIndex);
        setLightboxVisualIndex(1);
        setLightboxPendingDirection(0);

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [config.cardCount, isPreviewOpen, lightboxCards.length]);

    useEffect(() => {
        if (!isPreviewOpen) {
            return undefined;
        }

        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                onClosePreview?.();
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveLightboxTrack(1);
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveLightboxTrack(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPreviewOpen, onClosePreview]);

    useEffect(() => {
        if (!isPreviewOpen) {
            return undefined;
        }

        const handleWheel = event => {
            const target = lightboxViewportRef.current;
            if (!target || !target.contains(event.target)) {
                return;
            }

            const now = performance.now();
            const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;

            if (Math.abs(horizontalIntent) < 18 || now - wheelNavigationLockRef.current < 420) {
                return;
            }

            wheelNavigationLockRef.current = now;

            moveLightboxTrack(horizontalIntent > 0 ? 1 : -1);
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isPreviewOpen]);

    const handlePointerDown = event => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        event.preventDefault();
        dragStateRef.current = {
            active: true,
            pointerId: event.pointerId,
            startX: event.clientX,
            startRotation: rotationRef.current,
            lastX: event.clientX,
            lastTime: performance.now(),
        };
        inertiaVelocityRef.current = 0;
        pauseAutoRotateUntilRef.current = performance.now() + 1200;
        stageRef.current?.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = event => {
        const dragState = dragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = event.clientX - dragState.startX;
        const now = performance.now();
        const deltaTime = Math.max(1, now - dragState.lastTime);
        const nextRotation = normalizeRotation(
            dragState.startRotation + deltaX * orbitDragRotationFactor
        );
        const instantVelocity =
            ((event.clientX - dragState.lastX) * orbitDragRotationFactor) / deltaTime;

        inertiaVelocityRef.current = instantVelocity * orbitInertiaBlend + inertiaVelocityRef.current * (1 - orbitInertiaBlend);
        dragState.lastX = event.clientX;
        dragState.lastTime = now;
        rotationRef.current = nextRotation;
        setRotation(nextRotation);
    };

    const handlePointerRelease = event => {
        const dragState = dragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        dragStateRef.current = {
            active: false,
            pointerId: null,
            startX: 0,
            startRotation: rotationRef.current,
            lastX: 0,
            lastTime: 0,
        };
        pauseAutoRotateUntilRef.current = performance.now() + 700;
        if (stageRef.current?.hasPointerCapture?.(event.pointerId)) {
            stageRef.current.releasePointerCapture(event.pointerId);
        }
    };

    const handleLightboxPointerDown = event => {
        if (lightboxCards.length <= 1 || lightboxPendingDirection !== 0) {
            return;
        }

        event.preventDefault();
        lightboxDragStateRef.current = {
            active: true,
            pointerId: event.pointerId,
            startX: event.clientX,
        };
        setIsLightboxDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handleLightboxPointerMove = event => {
        const dragState = lightboxDragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        setLightboxDragOffset(event.clientX - dragState.startX);
    };

    const handleLightboxPointerRelease = event => {
        const dragState = lightboxDragStateRef.current;
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
            return;
        }

        const nextDragOffset = event.clientX - dragState.startX;
        const swipeThreshold = Math.min(140, viewportWidth * 0.12);

        if (nextDragOffset <= -swipeThreshold) {
            moveLightboxTrack(1);
        } else if (nextDragOffset >= swipeThreshold) {
            moveLightboxTrack(-1);
        }

        lightboxDragStateRef.current = {
            active: false,
            pointerId: null,
            startX: 0,
        };
        setLightboxDragOffset(0);
        setIsLightboxDragging(false);
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handleLightboxTrackTransitionEnd = () => {
        if (lightboxCards.length <= 1 || lightboxPendingDirection === 0) {
            return;
        }

        setLightboxActiveIndex(current => wrapCarouselIndex(current + lightboxPendingDirection, lightboxCards.length));
        setLightboxPendingDirection(0);
        setIsLightboxTrackTransitionEnabled(false);
        setLightboxVisualIndex(1);
    };

    useEffect(() => {
        if (isLightboxTrackTransitionEnabled) {
            return undefined;
        }

        const frameId = window.requestAnimationFrame(() => {
            setIsLightboxTrackTransitionEnabled(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isLightboxTrackTransitionEnabled]);

    return (
        <>
            <motion.section
                className={`relative overflow-hidden ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.35, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    ref={stageRef}
                    className={`relative mx-auto w-full overflow-hidden px-4 sm:px-6 lg:px-0 ${isOrbitDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerRelease}
                    onPointerCancel={handlePointerRelease}
                    onLostPointerCapture={handlePointerRelease}
                    style={{
                        height: `${config.stageHeight}px`,
                        maxWidth: `${config.stageMaxWidth}px`,
                        touchAction: 'pan-y',
                    }}
                >
                    <div
                        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
                        style={{
                            bottom: `${config.glowBottom}px`,
                            width: config.glowWidth,
                            height: `${config.glowHeight}px`,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 opacity-16"
                        style={{
                            top: config.guideTop,
                            width: `${config.guideWidth}px`,
                            height: `${config.guideHeight}px`,
                        }}
                    />
                    {cards.map((src, index) => (
                        <OrbitCard
                            key={src}
                            src={src}
                            index={index}
                            total={cards.length}
                            rotation={rotation}
                            config={config}
                            isDragging={isOrbitDragging}
                        />
                    ))}
                </div>
                <div
                    className="pointer-events-none absolute bottom-0 left-1/2 z-[200] -translate-x-1/2 overflow-hidden"
                    style={{
                        height: config.overlayHeight,
                        width: config.overlayWidth,
                    }}
                >
                    <div
                        className="absolute inset-x-0 bottom-0"
                        style={{
                            height: config.overlayBaseFillHeight,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,1) 100%)',
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: config.overlayGradient,
                        }}
                    />
                </div>
            </motion.section>

            {isPreviewOpen && typeof document !== 'undefined'
                ? createPortal(
                    <div ref={lightboxViewportRef}>
                        <HeroLightbox
                            cards={lightboxCards}
                            displayIndex={lightboxDisplayIndex}
                            activeIndex={lightboxActiveIndex}
                            visualIndex={lightboxVisualIndex}
                            dragOffset={lightboxDragOffset}
                            isDragging={isLightboxDragging}
                            isTrackTransitionEnabled={isLightboxTrackTransitionEnabled}
                            onPointerDown={handleLightboxPointerDown}
                            onPointerMove={handleLightboxPointerMove}
                            onPointerUp={handleLightboxPointerRelease}
                            onPointerCancel={handleLightboxPointerRelease}
                            onTrackTransitionEnd={handleLightboxTrackTransitionEnd}
                            onClose={onClosePreview}
                            onNext={handleLightboxNext}
                            onPrevious={handleLightboxPrevious}
                        />
                    </div>,
                    document.body
                )
                : null}
        </>
    );
}
