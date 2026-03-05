import { useMemo } from 'react';

const marqueeImages = [
    'https://picsum.photos/seed/1/300/400',
    'https://picsum.photos/seed/2/300/400',
    'https://picsum.photos/seed/3/300/400',
    'https://picsum.photos/seed/4/300/400',
    'https://picsum.photos/seed/5/300/400',
    'https://picsum.photos/seed/6/300/400',
    'https://picsum.photos/seed/7/300/400',
    'https://picsum.photos/seed/8/300/400',
    'https://picsum.photos/seed/9/300/400',
    'https://picsum.photos/seed/10/300/400',
    'https://picsum.photos/seed/11/300/400',
    'https://picsum.photos/seed/12/300/400',
];

const WIDTH_OPTIONS = [200, 220, 260, 280, 320, 340];

const MarqueeRow = ({ reverse = false, widths }) => (
    <div className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {marqueeImages.map((src, i) => (
            <div
                key={`a-${i}`}
                className="flex-shrink-0 h-[360px] mx-3 rounded-lg overflow-hidden"
                style={{ width: widths[i] }}
            >
                <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
        ))}
        {marqueeImages.map((src, i) => (
            <div
                key={`b-${i}`}
                className="flex-shrink-0 h-[360px] mx-3 rounded-lg overflow-hidden"
                style={{ width: widths[i] }}
            >
                <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
        ))}
    </div>
);

export default function Marquee() {
    const widths = useMemo(
        () => marqueeImages.map(() => WIDTH_OPTIONS[Math.floor(Math.random() * WIDTH_OPTIONS.length)]),
        []
    );

    return (
        <section className="relative bg-black py-8 overflow-hidden flex flex-col gap-4">
            <MarqueeRow widths={widths} />
            <MarqueeRow reverse widths={widths} />
        </section>
    );
}
