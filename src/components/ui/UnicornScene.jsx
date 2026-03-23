import { useEffect, useId, useRef } from 'react';

const UNICORN_SDK_URL =
    'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.5/dist/unicornStudio.umd.js';

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

export default function UnicornScene({
    filePath,
    className = '',
    scale = 1,
    dpi = 1.5,
    fps = 60,
    lazyLoad = false,
    altText = 'Decorative animated Unicorn Studio scene',
    ariaLabel = 'Decorative animated Unicorn Studio scene',
    ariaHidden = true,
    interactivity = {
        mouse: {
            disableMobile: true,
        },
    },
}) {
    const rawId = useId();
    const elementId = `unicorn-scene-${rawId.replace(/:/g, '')}`;
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
                filePath,
                scale,
                dpi,
                fps,
                lazyLoad,
                altText,
                ariaLabel,
                interactivity,
            });

            if (cancelled) {
                scene.destroy?.();
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
            sceneRef.current?.destroy?.();
            sceneRef.current = null;
        };
    }, [ariaLabel, altText, dpi, elementId, filePath, fps, interactivity, lazyLoad, scale]);

    return <div id={elementId} className={className} aria-hidden={ariaHidden} />;
}
