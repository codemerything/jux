import { useState, useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting && !hasIntersected) {
                    setHasIntersected(true);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
                ...options
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options, hasIntersected]);

    return { ref, isIntersecting, hasIntersected };
}

// Hook for tracking which element in a list is most visible
export function useActiveSection(refs, options = {}) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observers = refs.map((ref, index) => {
            if (!ref.current) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex(index);
                    }
                },
                {
                    root: null,
                    rootMargin: '-40% 0px -40% 0px',
                    threshold: 0,
                    ...options
                }
            );

            observer.observe(ref.current);
            return observer;
        });

        return () => {
            observers.forEach(obs => obs?.disconnect());
        };
    }, [refs, options]);

    return activeIndex;
}
