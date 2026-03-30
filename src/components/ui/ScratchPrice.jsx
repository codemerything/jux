import { useRef, useState, useEffect } from 'react';

export default function ScratchPrice({ price }) {
    const canvasRef = useRef(null);
    const textRef = useRef(null);
    const wrapperRef = useRef(null);
    const [revealed, setRevealed] = useState(false);
    const [overlaySize, setOverlaySize] = useState({ width: 176, height: 48 });
    const isDrawing = useRef(false);
    const lastPos = useRef(null);

    const isEnquiry = price === 'on enquiry';

    useEffect(() => {
        if (isEnquiry) return;

        const textElement = textRef.current;
        const wrapperElement = wrapperRef.current;
        if (!textElement || !wrapperElement) return;

        const syncOverlaySize = () => {
            const textRect = textElement.getBoundingClientRect();
            const wrapperRect = wrapperElement.getBoundingClientRect();
            setOverlaySize({
                width: Math.ceil(wrapperRect.width),
                height: Math.ceil(textRect.height + 16),
            });
        };

        syncOverlaySize();

        const resizeObserver = new ResizeObserver(syncOverlaySize);
        resizeObserver.observe(textElement);
        resizeObserver.observe(wrapperElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isEnquiry, price]);

    useEffect(() => {
        if (revealed || isEnquiry) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gold metallic scratchable surface
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#b8860b');
        grad.addColorStop(0.3, '#daa520');
        grad.addColorStop(0.5, '#ffd700');
        grad.addColorStop(0.7, '#daa520');
        grad.addColorStop(1, '#b8860b');
        ctx.fillStyle = grad;
        ctx.roundRect(0, 0, canvas.width, canvas.height, 6);
        ctx.fill();

        // Subtle sheen stripe
        const sheen = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        sheen.addColorStop(0, 'rgba(255,255,255,0)');
        sheen.addColorStop(0.45, 'rgba(255,255,255,0.18)');
        sheen.addColorStop(0.55, 'rgba(255,255,255,0.18)');
        sheen.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sheen;
        ctx.roundRect(0, 0, canvas.width, canvas.height, 6);
        ctx.fill();

        // Hint text
        ctx.fillStyle = 'rgba(80,50,0,0.7)';
        ctx.font = '600 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('scratch to reveal', canvas.width / 2, canvas.height / 2);
    }, [overlaySize, revealed, isEnquiry]);

    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
        };
    };

    const scratch = (e) => {
        if (!isDrawing.current || revealed) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e, canvas);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fill();

        if (lastPos.current) {
            ctx.beginPath();
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.moveTo(lastPos.current.x, lastPos.current.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
        lastPos.current = pos;

        // Check revealed %
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 128) transparent++;
        }
        if (transparent / (canvas.width * canvas.height) > 0.45) {
            setRevealed(true);
        }
    };

    if (isEnquiry) {
        return (
            <span
                className="block w-full text-center text-white/30 italic font-normal"
                style={{ fontSize: 'var(--text-h6)' }}
            >
                {price}
            </span>
        );
    }

    return (
        <div
            ref={wrapperRef}
            className="relative flex w-full items-center justify-center"
            style={{
                minHeight: `${overlaySize.height}px`,
            }}
        >
            {/* Price sits underneath, large and white so it's clearly readable once scratched */}
            <span
                ref={textRef}
                className="block w-full text-center font-extrabold text-white"
                style={{ fontSize: 'var(--text-h5)' }}
            >
                {price}
            </span>

            {/* Scratch overlay canvas */}
            {!revealed && (
                <canvas
                    ref={canvasRef}
                    width={overlaySize.width}
                    height={overlaySize.height}
                    className="absolute inset-0 w-full h-full cursor-crosshair rounded-md touch-none select-none"
                    onMouseDown={(e) => {
                        isDrawing.current = true;
                        lastPos.current = null;
                        scratch(e);
                    }}
                    onMouseMove={scratch}
                    onMouseUp={() => { isDrawing.current = false; }}
                    onMouseLeave={() => { isDrawing.current = false; }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        isDrawing.current = true;
                        lastPos.current = null;
                        scratch(e);
                    }}
                    onTouchMove={(e) => { e.preventDefault(); scratch(e); }}
                    onTouchEnd={() => { isDrawing.current = false; }}
                />
            )}
        </div>
    );
}
