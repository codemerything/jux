import { useEffect, useRef, useState } from 'react';

/**
 * High-performance 3D hover physics hook for Void Matrix cards.
 * Manages dual-device interaction (mouse tracked dragging + touch discrete tapping).
 */
export function useCardTilt() {
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const card = cardRef.current;

        if (!wrapper || !card) return;

        let enterTimeout;
        let isEntering = false;

        const handleMouseMove = (e) => {
            // Isolate physics engine: Do not run real-time hardware tracking if the device is a mobile touchscreen
            if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

            if (!isEntering) {
                card.style.transition = 'none';
            }

            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const glareX = 40 - ((x / rect.width) * 50);
            const glareY = 30 - ((y / rect.height) * 20);
            card.style.setProperty('--glare-x', `${glareX}%`);
            card.style.setProperty('--glare-y', `${glareY}%`);

            const shadowX = (centerX - x) / 15;
            const shadowY = (centerY - y) / 15;
            card.style.boxShadow = `${shadowX}px ${shadowY + 30}px 50px -15px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`;
        };

        const handleMouseLeave = () => {
            setIsActive(false);
            isEntering = false;
            clearTimeout(enterTimeout);

            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            card.style.transition = `transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`;
        };

        const handleMouseEnter = () => {
            setIsActive(true);
            
            card.style.transition = `transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            
            clearTimeout(enterTimeout);
            isEntering = true;
            
            enterTimeout = window.setTimeout(() => {
                isEntering = false;
            }, 300);
        };

        const handleTouchStart = (e) => {
            setIsActive(true);
            
            const touch = e.touches[0];
            const rect = wrapper.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            card.style.transition = `transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease-out`;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const glareX = 40 - ((x / rect.width) * 50);
            const glareY = 30 - ((y / rect.height) * 20);
            card.style.setProperty('--glare-x', `${glareX}%`);
            card.style.setProperty('--glare-y', `${glareY}%`);
            
            const shadowX = (centerX - x) / 10;
            const shadowY = (centerY - y) / 10;
            card.style.boxShadow = `${shadowX}px ${shadowY + 30}px 50px -15px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`;
        };

        const handleTouchEnd = () => {
            setIsActive(false);
            
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            card.style.transition = `transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`;
        };

        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseleave', handleMouseLeave);
        wrapper.addEventListener('mouseenter', handleMouseEnter);
        wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            wrapper.removeEventListener('mousemove', handleMouseMove);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);
            wrapper.removeEventListener('mouseenter', handleMouseEnter);
            wrapper.removeEventListener('touchstart', handleTouchStart);
            wrapper.removeEventListener('touchend', handleTouchEnd);
            clearTimeout(enterTimeout);
        };
    }, []);

    return { wrapperRef, cardRef, isActive };
}
