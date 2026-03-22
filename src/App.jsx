import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Services from './components/sections/Services';
import LaptopServices from './components/sections/LaptopServices';
import CTA from './components/sections/CTA';
import ServicesMenu from './components/sections/ServicesMenu';
import UnicornHeroBackground from './components/ui/UnicornHeroBackground';

function App() {
    return (
        <div className="min-h-screen bg-black text-gray-900 relative flex flex-col">
            <main className="flex-1">
                <div className="relative overflow-hidden">
                    <UnicornHeroBackground />
                    <div className="absolute inset-0 z-[1] bg-black/35" />
                    <Hero />
                    <Marquee rows="top" className="relative z-10 pt-8" />
                    <Navbar />
                </div>

                <Services />
                <LaptopServices />
                <ServicesMenu />
                <CTA />
            </main>

            <Footer />
        </div>
    );
}

export default App;
