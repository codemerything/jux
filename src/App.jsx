import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [location.hash, location.pathname]);

    return null;
}

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </>
    );
}
