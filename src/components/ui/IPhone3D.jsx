import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// iPhone 17 Pro Max proportions (in Three.js units)
const PHONE = {
    width: 2.8,
    height: 5.8,
    depth: 0.28,
    cornerRadius: 0.38,
    screenInset: 0.06,
    frameColor: '#9B7B2C',
    bodyColor: '#111111',
};

function PhoneBody() {
    return (
        <group>
            {/* Titanium/Bronze Frame - very thin edge band */}
            <RoundedBox
                args={[PHONE.width + 0.06, PHONE.height + 0.06, PHONE.depth + 0.01]}
                radius={PHONE.cornerRadius + 0.02}
                smoothness={10}
            >
                <meshStandardMaterial
                    color={PHONE.frameColor}
                    metalness={0.92}
                    roughness={0.1}
                />
            </RoundedBox>

            {/* Main body - dark glass back, covers most of the frame */}
            <RoundedBox
                args={[PHONE.width, PHONE.height, PHONE.depth + 0.02]}
                radius={PHONE.cornerRadius}
                smoothness={10}
            >
                <meshStandardMaterial
                    color={PHONE.bodyColor}
                    metalness={0.05}
                    roughness={0.3}
                />
            </RoundedBox>
        </group>
    );
}

function ScreenGlass({ gradient }) {
    const screenW = PHONE.width - PHONE.screenInset * 2;
    const screenH = PHONE.height - PHONE.screenInset * 2;

    // Parse gradient to get colors for the screen
    const colors = React.useMemo(() => {
        if (!gradient?.background) return ['#667eea', '#764ba2'];
        const matches = gradient.background.match(/#[a-fA-F0-9]{6}/g);
        return matches || ['#667eea', '#764ba2'];
    }, [gradient]);

    // Create gradient texture
    const texture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, colors[0]);
        grd.addColorStop(1, colors[1]);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, [colors]);

    return (
        <group position={[0, 0, PHONE.depth / 2 + 0.012]}>
            <RoundedBox
                args={[screenW, screenH, 0.005]}
                radius={PHONE.cornerRadius - PHONE.screenInset}
                smoothness={10}
            >
                <meshBasicMaterial map={texture} />
            </RoundedBox>
        </group>
    );
}

function ScreenOverlay({ service }) {
    const screenW = PHONE.width - PHONE.screenInset * 2;
    const screenH = PHONE.height - PHONE.screenInset * 2;

    // Render stats as a canvas texture on a plane sitting on top of the gradient
    const texture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 1100;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Label
        ctx.font = '600 26px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.textAlign = 'center';
        ctx.fillText(service.displayLabel, 300, 380);

        // Stat - big and bold
        ctx.font = '900 140px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(service.stat, 300, 560);

        // Stat label
        ctx.font = '400 28px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(service.statLabel, 300, 620);

        // Progress bar bg
        const barX = 200;
        const barY = 680;
        const barW = 200;
        const barH = 6;
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        roundRect(ctx, barX, barY, barW, barH, 3);
        ctx.fill();

        // Progress bar fill
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, barX, barY, barW * 0.78, barH, 3);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, [service.stat, service.displayLabel, service.statLabel]);

    return (
        <group position={[0, 0, PHONE.depth / 2 + 0.016]}>
            <mesh>
                <planeGeometry args={[screenW, screenH]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        </group>
    );
}

// Helper: draw a rounded rectangle on a canvas
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function DynamicIsland() {
    const pillWidth = 0.7;
    const pillHeight = 0.14;
    const yPos = PHONE.height / 2 - 0.32;

    return (
        <group position={[0, yPos, PHONE.depth / 2 + 0.019]}>
            <RoundedBox
                args={[pillWidth, pillHeight, 0.004]}
                radius={pillHeight / 2}
                smoothness={8}
            >
                <meshBasicMaterial color="#000000" />
            </RoundedBox>
        </group>
    );
}

function SideButtons() {
    const mat = <meshStandardMaterial color={PHONE.frameColor} metalness={0.9} roughness={0.15} />;
    return (
        <group>
            {/* Power button - right */}
            <mesh position={[PHONE.width / 2 + 0.035, 0.8, 0]}>
                <boxGeometry args={[0.02, 0.5, 0.08]} />
                {mat}
            </mesh>
            {/* Volume up - left */}
            <mesh position={[-PHONE.width / 2 - 0.035, 1.0, 0]}>
                <boxGeometry args={[0.02, 0.35, 0.08]} />
                {mat}
            </mesh>
            {/* Volume down - left */}
            <mesh position={[-PHONE.width / 2 - 0.035, 0.5, 0]}>
                <boxGeometry args={[0.02, 0.35, 0.08]} />
                {mat}
            </mesh>
            {/* Action button - left */}
            <mesh position={[-PHONE.width / 2 - 0.035, 1.6, 0]}>
                <boxGeometry args={[0.02, 0.18, 0.08]} />
                {mat}
            </mesh>
        </group>
    );
}

function HomeIndicator() {
    return (
        <group position={[0, -PHONE.height / 2 + 0.22, PHONE.depth / 2 + 0.019]}>
            <RoundedBox args={[0.5, 0.035, 0.002]} radius={0.017} smoothness={4}>
                <meshBasicMaterial color="#444444" />
            </RoundedBox>
        </group>
    );
}

function IPhoneModel({ activeService, services, screenStyles }) {
    const groupRef = useRef();
    const activeIdx = services.findIndex((s) => s.id === activeService);
    const activeServiceData = services[activeIdx];
    const activeStyle = screenStyles?.[activeIdx] || screenStyles?.[0];

    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = -0.08 + Math.sin(state.clock.elapsedTime * 0.4) * 0.025;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
        }
    });

    return (
        <group ref={groupRef}>
            <PhoneBody />
            <ScreenGlass gradient={activeStyle} />
            {activeServiceData && <ScreenOverlay service={activeServiceData} />}
            <DynamicIsland />
            <SideButtons />
            <HomeIndicator />
        </group>
    );
}

// Error boundary to prevent crashes
class CanvasErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-[650px] flex items-center justify-center text-gray-400 text-sm">
                    3D view unavailable
                </div>
            );
        }
        return this.props.children;
    }
}

export default function IPhone3D({
    activeService,
    services,
    screenStyles,
    className = '',
}) {
    return (
        <CanvasErrorBoundary>
            <div className={`w-full h-[650px] ${className}`}>
                <Canvas
                    camera={{ position: [0, 0, 7], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                    style={{ background: 'transparent' }}
                >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[4, 4, 6]} intensity={0.9} />
                    <directionalLight position={[-3, 2, 4]} intensity={0.35} />
                    <spotLight
                        position={[0, 6, 4]}
                        angle={0.35}
                        penumbra={0.6}
                        intensity={0.4}
                    />
                    <pointLight position={[2, -2, 3]} intensity={0.2} color="#ffffff" />

                    <Suspense fallback={null}>
                        <IPhoneModel
                            activeService={activeService}
                            services={services}
                            screenStyles={screenStyles}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </CanvasErrorBoundary>
    );
}
