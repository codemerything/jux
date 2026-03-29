import { useEffect, useState } from 'react';
import UnicornScene from './UnicornScene';
import mobileHeroVideoMp4 from '../../../heroImages/unicorn/inverted_trail_remix.mp4';

export default function UnicornHeroBackground() {
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

    if (viewportWidth < 768) {
        return (
            <video
                className="absolute inset-0 z-0 h-full w-full object-cover object-right"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src={mobileHeroVideoMp4} type="video/mp4" />
            </video>
        );
    }

    const isTablet = viewportWidth < 1280;

    return (
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
    );
}
