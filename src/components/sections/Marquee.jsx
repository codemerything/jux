import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import MediaLightbox from '../ui/MediaLightbox';

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
        overlayBottomOffset: -10,
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
        overlayBottomOffset: 0,
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
        overlayBottomOffset: 0,
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

const OrbitCard = forwardRef(({ src, config, isDragging }, ref) => {
    return (
        <div
            ref={ref}
            className="pointer-events-none absolute left-1/2"
            style={{
                top: config.cardTop,
                width: `${config.cardWidth}px`,
                height: `${config.cardHeight}px`,
                opacity: 0,
                transformOrigin: 'center center',
                willChange: 'transform, opacity, filter'
            }}
        >
            <motion.div
                className="orbit-card-shadow relative isolate h-full w-full rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_18%,rgba(255,255,255,0.06)_52%,rgba(255,255,255,0.16)_100%)] p-px transition-shadow duration-75"
                animate={isDragging ? { scale: 1.002 } : { scale: 1 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
});

export default function Marquee({ className = '', isPreviewOpen = false, onClosePreview }) {
    const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
    const stageRef = useRef(null);
    const frameRef = useRef(null);
    const lastTimeRef = useRef(null);
    const rotationRef = useRef(0);
    const cardRefs = useRef([]);
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
    const isTouchCarousel = viewportWidth < 768;
    const lightboxSlides = lightboxCardSet.map(card => ({
        type: 'image',
        src: isTouchCarousel ? card.mobileSrc : card.src,
    }));
    const isOrbitDragging = dragStateRef.current.active;
    const orbitDragRotationFactor = isTouchCarousel ? MOBILE_DRAG_ROTATION_FACTOR : DESKTOP_DRAG_ROTATION_FACTOR;
    const orbitInertiaBlend = isTouchCarousel ? 0.7 : 0.45;

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

            let currentRotation = rotationRef.current;

            if (dragStateRef.current.active || now < pauseAutoRotateUntilRef.current) {
                const delta = Math.min(now - lastTimeRef.current, 32);
                lastTimeRef.current = now;

                if (!dragStateRef.current.active && Math.abs(inertiaVelocityRef.current) > MOBILE_INERTIA_MIN_VELOCITY) {
                    currentRotation = normalizeRotation(
                        currentRotation + inertiaVelocityRef.current * delta
                    );
                    inertiaVelocityRef.current *= Math.pow(MOBILE_INERTIA_DAMPING, delta / 16);
                } else if (!dragStateRef.current.active) {
                    inertiaVelocityRef.current = 0;
                }
            } else {
                const delta = Math.min(now - lastTimeRef.current, 32);
                lastTimeRef.current = now;
                currentRotation = normalizeRotation(currentRotation + delta * config.speed);
            }

            rotationRef.current = currentRotation;

            // --- IMPERATIVE UPDATES BYPASSING REACT DOM DIFFING ---
            const total = cards.length;
            cards.forEach((_, index) => {
                const el = cardRefs.current[index];
                if (!el) return;
                const shadowEl = el.querySelector('.orbit-card-shadow');
                
                const seed = index / total;
                const baseAngle = currentRotation + seed * TAU;
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
                
                const frontOpacity = depth > config.fullOpacityThreshold ? 1 : config.opacityMin + (depth / config.fullOpacityThreshold) * (1 - config.opacityMin);
                const opacity = Math.min(1, frontOpacity);
                const blur = isTouchCarousel ? 0 : (1 - depth) * config.blurMax; // MOBILE OPTIMIZATION
                const shadowOpacity = config.shadowBase + depth * config.shadowRange - frontPullback * config.shadowPullback;
                const zIndex = Math.round(depth * 100);

                el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
                el.style.zIndex = zIndex;
                el.style.opacity = opacity;
                if (blur > 0) {
                    el.style.filter = `blur(${blur}px)`;
                } else {
                    el.style.filter = 'none';
                }

                if (shadowEl) {
                    shadowEl.style.boxShadow = `0 36px 96px rgba(0,0,0,${Math.min(0.52, shadowOpacity + 0.08)}), 0 14px 34px rgba(0,0,0,${Math.max(0.16, shadowOpacity * 0.62)})`;
                }
            });

            frameRef.current = window.requestAnimationFrame(animate);
        };

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [config, cards, isTouchCarousel]);

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
                            ref={(el) => (cardRefs.current[index] = el)}
                            src={src}
                            config={config}
                            isDragging={isOrbitDragging}
                        />
                    ))}
                </div>
                <div
                    className="pointer-events-none absolute bottom-0 left-1/2 z-[200] -translate-x-1/2 overflow-hidden"
                    style={{
                        bottom: `${config.overlayBottomOffset ?? 0}px`,
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

            <MediaLightbox
                isOpen={isPreviewOpen}
                slides={lightboxSlides}
                initialIndex={Math.max(0, lightboxCardSet.findIndex(card => card.src === cards[getFrontCardIndex(cards.length, rotationRef.current)]))}
                onClose={onClosePreview}
                title="Featured Work"
                showTitle={false}
                closeLabel="Close featured work gallery"
            />
        </>
    );
}
