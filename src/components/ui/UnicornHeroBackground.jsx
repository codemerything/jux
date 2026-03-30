import { useEffect, useRef, useState } from 'react';
import UnicornScene from './UnicornScene';

export default function UnicornHeroBackground() {
    const mobileVideoRef = useRef(null);
    const [isMobileVideoReady, setIsMobileVideoReady] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(() => (
        typeof window === 'undefined' ? 1440 : window.innerWidth
    ));

    useEffect(() => {
        const syncViewportWidth = () => {
            setViewportWidth(window.innerWidth);
        };

        syncViewportWidth();
        window.addEventListener('resize', syncViewportWidth);

        return () => {
            window.removeEventListener('resize', syncViewportWidth);
        };
    }, []);

    useEffect(() => {
        const video = mobileVideoRef.current;

        if (!video) {
            return undefined;
        }

        setIsMobileVideoReady(video.readyState >= 2);
        video.defaultMuted = true;

        const tryPlay = () => {
            const playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        };

        const handleReady = () => {
            setIsMobileVideoReady(true);
            tryPlay();
        };

        tryPlay();
        video.addEventListener('loadeddata', handleReady);
        video.addEventListener('canplay', handleReady);

        return () => {
            video.removeEventListener('loadeddata', handleReady);
            video.removeEventListener('canplay', handleReady);
        };
    }, []);

    const isDesktop = viewportWidth >= 768;
    const isTablet = viewportWidth < 1280;

    return (
        <>
            {!isDesktop ? (
                <video
                    ref={mobileVideoRef}
                    className={`absolute inset-0 z-0 h-full w-full object-cover object-right transition-opacity duration-500 ${
                        isMobileVideoReady ? 'opacity-100' : 'opacity-0'
                    }`}
                    src="/unicorn/newtrail1.mp4"
                    autoPlay
                    loop
                    muted
                    defaultMuted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    aria-hidden="true"
                />
            ) : (
                <UnicornScene
                    filePath="/unicorn/hero-background.json"
                    className="absolute inset-0 z-0"
                    scale={isTablet ? 0.82 : 0.9}
                    dpi={isTablet ? 1 : 1.2}
                    fps={isTablet ? 36 : 48}
                    lazyLoad
                    altText="Interactive hero background animation"
                    ariaLabel="Decorative animated shader behind the hero section"
                    ariaHidden
                />
            )}
        </>
    );
}
