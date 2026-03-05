import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { modelFeatures } from '../../data/services';

export default function Model() {
    return (
        <section id="model" className="relative bg-[#fafafa] py-24">
            <div className="max-w-[1400px] mx-auto px-8">
                {/* Header */}
                <RevealItem>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight mb-4 text-gray-900">
                            Leverage AI agents with expert led strategies for fully managed outcomes.
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Our proprietary technology combined with seasoned marketing expertise delivers results that scale.
                        </p>
                    </div>
                </RevealItem>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modelFeatures.map((feature, index) => (
                        <RevealItem key={index} delay={index * 150}>
                            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                                    <FeatureIcon name={feature.icon} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        </RevealItem>
                    ))}
                </div>
            </div>
        </section>
    );
}

function RevealItem({ children, delay = 0 }) {
    const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className="transition-all duration-700 ease-out"
            style={{
                opacity: hasIntersected ? 1 : 0,
                transform: hasIntersected ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}

function FeatureIcon({ name }) {
    const icons = {
        clock: (
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        lightning: (
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        users: (
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    };
    return icons[name] || null;
}
