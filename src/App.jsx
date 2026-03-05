import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Services from './components/sections/Services';
import LaptopServices from './components/sections/LaptopServices';
import CTA from './components/sections/CTA';
import ServicesMenu from './components/sections/ServicesMenu';

function App() {
    return (
        <div className="min-h-screen bg-black text-gray-900 relative flex flex-col">
            {/* Dither effect overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />
            <main className="flex-1">
                {/* Navbar sticks within this container, scrolls away when Hero ends */}
                <div className="relative">
                    <Navbar />
                    <Hero />
                </div>

                <Marquee />

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
