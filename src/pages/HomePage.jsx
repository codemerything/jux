import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import Services from '../components/sections/Services';
import VoidMatrixSection from '../components/sections/VoidMatrixSection';
import CTA from '../components/sections/CTA';
import ServicesMenu from '../components/sections/ServicesMenu';
import UnicornHeroBackground from '../components/ui/UnicornHeroBackground';

export default function HomePage() {
    const [isHeroPreviewOpen, setIsHeroPreviewOpen] = useState(false);
    const [isPhonePreviewOpen, setIsPhonePreviewOpen] = useState(false);
    const isAnyPreviewOpen = isHeroPreviewOpen || isPhonePreviewOpen;

    return (
        <div className="min-h-screen bg-black text-gray-900 relative flex flex-col">
            <Navbar hidden={isAnyPreviewOpen} />

            <motion.div
                className="flex min-h-screen flex-col"
                animate={{
                    filter: isAnyPreviewOpen ? 'blur(18px) brightness(0.52)' : 'blur(0px) brightness(1)',
                    scale: 1,
                }}
                transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'center top' }}
            >
                <main className="flex-1">
                    <div
                        className="relative min-h-screen overflow-hidden"
                        style={{ minHeight: '100svh' }}
                    >
                        <UnicornHeroBackground />
                        <div className="absolute inset-0 z-[1] bg-black/35" />
                        <Hero
                            onOpenPreview={() => {
                                setIsPhonePreviewOpen(false);
                                setIsHeroPreviewOpen(true);
                            }}
                        />
                        <Marquee
                            rows="top"
                            className="relative z-10 pt-4"
                            isPreviewOpen={isHeroPreviewOpen}
                            onClosePreview={() => setIsHeroPreviewOpen(false)}
                        />
                        {/* Physical gradient bridging the Void-to-White transition outside of the child container */}
                        <div 
                            className="absolute bottom-0 inset-x-0 z-20 w-full h-[140px] md:h-[220px]"
                            style={{ 
                                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.45) 40%, rgba(255, 255, 255, 0.75) 60%, #ffffff 100%)' 
                            }}
                            aria-hidden="true"
                        />
                    </div>

                    <Services
                        isPreviewOpen={isPhonePreviewOpen}
                        onOpenPreview={() => {
                            setIsHeroPreviewOpen(false);
                            setIsPhonePreviewOpen(true);
                        }}
                        onClosePreview={() => setIsPhonePreviewOpen(false)}
                    />
                    <VoidMatrixSection />
                    <ServicesMenu />
                    <CTA />
                </main>

                <Footer />
            </motion.div>
        </div>
    );
}
