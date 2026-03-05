import { useState, useEffect, useRef } from 'react';
import { laptopServices } from '../../data/services';

export default function LaptopServices() {
    const [activeService, setActiveService] = useState(0);
    const cardRefs = useRef([]);

    useEffect(() => {
        const observers = cardRefs.current.map((ref, index) => {
            if (!ref) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveService(index);
                    }
                },
                { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
            );

            observer.observe(ref);
            return observer;
        });

        return () => observers.forEach(obs => obs?.disconnect());
    }, []);

    const currentService = laptopServices[activeService];

    return (
        <section id="laptop-services" className="relative bg-[#f5f5f0] py-24 overflow-visible" aria-labelledby="laptop-services-heading">
            <h2 id="laptop-services-heading" className="sr-only">How we work</h2>
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

                    {/* Left: Scrolling Content */}
                    <div className="relative z-10 order-2 lg:order-1">
                        <div className="space-y-8">
                            {laptopServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    ref={el => cardRefs.current[index] = el}
                                    className={`p-8 rounded-2xl border transition-all duration-500 ${activeService === index
                                        ? 'bg-white border-gray-200 shadow-lg'
                                        : 'bg-transparent border-gray-100'
                                        }`}
                                >
                                    <h3 className="font-bold mb-4 text-gray-900" style={{ fontSize: 'var(--text-h4)' }}>{service.title}</h3>
                                    <p className="text-gray-500 mb-6 leading-relaxed" style={{ fontSize: 'var(--text-sm)' }}>{service.description}</p>

                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-gray-400 uppercase tracking-wider font-medium" style={{ fontSize: 'var(--text-xs)' }}>
                                            {service.price}
                                        </span>
                                        <a href="#contact" className="font-semibold text-accent hover:underline" style={{ fontSize: 'var(--text-sm)' }}>
                                            Get a Quote
                                        </a>
                                    </div>

                                    {service.testimonial && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <p className="text-gray-600 mb-4 italic" style={{ fontSize: 'var(--text-sm)' }}>
                                                "{service.testimonial.quote}"
                                            </p>
                                            <div>
                                                <span className="font-semibold text-gray-900" style={{ fontSize: 'var(--text-sm)' }}>{service.testimonial.author}</span>
                                                <span className="text-gray-500 ml-2" style={{ fontSize: 'var(--text-xs)' }}>{service.testimonial.title}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Sticky Glass Laptop */}
                    <div className="hidden lg:flex sticky top-1/2 -translate-y-1/2 h-[80vh] items-center justify-end z-10 order-1 lg:order-2">
                        <div className="relative">
                            {/* Laptop Body */}
                            <div className="relative w-[500px]">
                                {/* Screen */}
                                <div className="relative bg-gray-800 rounded-t-xl p-3 border border-gray-700 aspect-16/10">
                                    {/* Camera notch */}
                                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-600" />

                                    {/* Screen glass overlay */}
                                    <div className="absolute inset-3 bg-linear-to-br from-white/10 to-transparent rounded-lg pointer-events-none z-10" />

                                    {/* Screen content */}
                                    <div className="w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                        <div className="text-center p-8 transition-all duration-500">
                                            <div className="font-bold tracking-[0.2em] text-accent mb-4" style={{ fontSize: 'var(--text-xs)' }}>
                                                {currentService.displayLabel}
                                            </div>

                                            {activeService === 0 && (
                                                <div className="flex justify-center gap-4 mb-4">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-4 h-4 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                                    ))}
                                                </div>
                                            )}

                                            {activeService === 1 && (
                                                <div className="flex justify-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-lg" style={{ background: '#6366f1' }} />
                                                    <div className="w-8 h-8 rounded-lg" style={{ background: '#a855f7' }} />
                                                    <div className="w-8 h-8 rounded-lg" style={{ background: '#f43f5e' }} />
                                                </div>
                                            )}

                                            {activeService === 2 && (
                                                <div className="space-y-2 mb-4 max-w-[200px] mx-auto">
                                                    <div className="h-2 bg-gray-200 rounded animate-pulse" />
                                                    <div className="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
                                                    <div className="h-2 bg-gray-50 rounded animate-pulse w-1/2" />
                                                </div>
                                            )}

                                            {activeService === 3 && (
                                                <div className="flex justify-center items-end gap-2 h-16 mb-4">
                                                    <div className="w-6 bg-linear-to-t from-accent to-purple-400 rounded-t" style={{ height: '40%' }} />
                                                    <div className="w-6 bg-linear-to-t from-accent to-purple-400 rounded-t" style={{ height: '70%' }} />
                                                    <div className="w-6 bg-linear-to-t from-accent to-purple-400 rounded-t" style={{ height: '100%' }} />
                                                </div>
                                            )}

                                            <div className="text-gray-500" style={{ fontSize: 'var(--text-sm)' }}>
                                                {currentService.displayContent}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Laptop Base */}
                                <div className="relative h-3 bg-linear-to-b from-gray-700 to-gray-800 rounded-b-xl">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-b-lg" />
                                </div>

                                {/* Reflection */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-1 bg-linear-to-r from-transparent via-gray-300/30 to-transparent rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
