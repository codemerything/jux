import UnicornScene from './UnicornScene';

export default function UnicornHeroBackground() {
    return (
        <UnicornScene
            filePath="/unicorn/hero-background.json"
            className="absolute inset-0 z-0"
            scale={0.9}
            dpi={1.5}
            fps={60}
            lazyLoad={false}
            altText="Interactive hero background animation"
            ariaLabel="Decorative animated shader behind the hero section"
            ariaHidden
        />
    );
}
