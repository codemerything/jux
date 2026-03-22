import { useEffect, useId, useRef } from 'react';

const UNICORN_SDK_URL =
    'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';

let unicornScriptPromise;

function loadUnicornStudio() {
    if (typeof window === 'undefined') {
        return Promise.resolve(null);
    }

    if (window.UnicornStudio?.addScene) {
        return Promise.resolve(window.UnicornStudio);
    }

    if (!unicornScriptPromise) {
        unicornScriptPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${UNICORN_SDK_URL}"]`);

            const handleLoad = () => resolve(window.UnicornStudio);
            const handleError = () => reject(new Error('Failed to load Unicorn Studio SDK.'));

            if (existingScript) {
                if (existingScript.dataset.loaded === 'true') {
                    resolve(window.UnicornStudio);
                    return;
                }

                existingScript.addEventListener('load', handleLoad, { once: true });
                existingScript.addEventListener('error', handleError, { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = UNICORN_SDK_URL;
            script.async = true;
            script.addEventListener(
                'load',
                () => {
                    script.dataset.loaded = 'true';
                    resolve(window.UnicornStudio);
                },
                { once: true },
            );
            script.addEventListener('error', handleError, { once: true });
            document.head.appendChild(script);
        });
    }

    return unicornScriptPromise;
}

export default function UnicornHeroBackground() {
    const rawId = useId();
    const elementId = `unicorn-hero-${rawId.replace(/:/g, '')}`;
    const sceneRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        const mountScene = async () => {
            const UnicornStudio = await loadUnicornStudio();

            if (cancelled || !UnicornStudio?.addScene) {
                return;
            }

            const scene = await UnicornStudio.addScene({
                elementId,
                filePath: '/unicorn/hero-background.json',
                scale: 0.9,
                dpi: 1.5,
                fps: 60,
                lazyLoad: false,
                altText: 'Interactive hero background animation',
                ariaLabel: 'Decorative animated shader behind the hero section',
                interactivity: {
                    mouse: {
                        disableMobile: true,
                    },
                },
            });

            if (cancelled) {
                scene.destroy();
                return;
            }

            sceneRef.current = scene;
            scene.resize?.();
        };

        void mountScene();

        const handleResize = () => {
            sceneRef.current?.resize?.();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelled = true;
            window.removeEventListener('resize', handleResize);
            sceneRef.current?.destroy();
            sceneRef.current = null;
        };
    }, [elementId]);

    return <div id={elementId} className="absolute inset-0 z-0" aria-hidden="true" />;
}
