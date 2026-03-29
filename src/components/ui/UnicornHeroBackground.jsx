import { useEffect, useRef, useState } from 'react';
import UnicornScene from './UnicornScene';

export default function UnicornHeroBackground() {
    const mobileVideoRef = useRef(null);
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

        video.defaultMuted = true;

        const tryPlay = () => {
            const playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        };

        tryPlay();
        video.addEventListener('canplay', tryPlay);

        return () => {
            video.removeEventListener('canplay', tryPlay);
        };
    }, []);

    const isTablet = viewportWidth < 1280;

    return (
        <>
            <video
                ref={mobileVideoRef}
                className="absolute inset-0 z-0 h-full w-full object-cover object-right md:hidden"
                src="/unicorn/inverted_trail_remix.mp4"
                autoPlay
                loop
                muted
                defaultMuted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                poster="/unicorn/testsmall.png"
                disablePictureInPicture
                disableRemotePlayback
                aria-hidden="true"
            />

            <UnicornScene
                filePath="/unicorn/hero-background.json"
                className="absolute inset-0 z-0 hidden md:block"
                scale={isTablet ? 0.82 : 0.9}
                dpi={isTablet ? 1 : 1.2}
                fps={isTablet ? 36 : 48}
                lazyLoad
                altText="Interactive hero background animation"
                ariaLabel="Decorative animated shader behind the hero section"
                ariaHidden
            />
        </>
    );
}
