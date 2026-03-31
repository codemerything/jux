import { useId } from 'react';
import { motion } from 'framer-motion';

const palettes = {
    1: {
        primary: '#4f6dff',
        secondary: '#72d6ff',
        glow: 'rgba(79, 109, 255, 0.18)',
        soft: 'rgba(79, 109, 255, 0.1)',
        surface: '#f7faff',
    },
    2: {
        primary: '#ef7a57',
        secondary: '#f7c86a',
        glow: 'rgba(239, 122, 87, 0.18)',
        soft: 'rgba(239, 122, 87, 0.1)',
        surface: '#fff9f3',
    },
    3: {
        primary: '#1797b8',
        secondary: '#7fe7ff',
        glow: 'rgba(23, 151, 184, 0.18)',
        soft: 'rgba(23, 151, 184, 0.1)',
        surface: '#f3fcff',
    },
    4: {
        primary: '#17a36b',
        secondary: '#8fe1b1',
        glow: 'rgba(23, 163, 107, 0.18)',
        soft: 'rgba(23, 163, 107, 0.1)',
        surface: '#f5fdf8',
    },
};

const sharedTransition = {
    repeat: Infinity,
    ease: 'easeInOut',
};

function SignalFrame({ palette, chips = [], children }) {
    return (
        <div
            className="relative overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-5px_-5px_10px_rgba(15,23,42,0.045)]"
        >
            <div
                className="relative aspect-[320/192] w-full overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, ${palette.surface} 100%)`,
                }}
            >
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.3) 100%)',
                    }}
                    aria-hidden="true"
                />
                {children}
            </div>

            {chips.length ? (
                <div className="relative flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
                    {chips.map((chip) => (
                        <span
                            key={chip}
                            className="rounded-full border border-gray-200 bg-white/88 px-3 py-1.5 text-[11px] font-medium leading-none text-gray-700"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function InfrastructureGlyph({ palette, isActive, prefix, chips }) {
    const nodes = [
        { id: 'aa', x: 74, y: -10, radius: 3 },
        { id: 'a', x: -20, y: 122, radius: 5.5 },
        { id: 'b', x: 20, y: 42, radius: 3.5 },
        { id: 'c', x: 56, y: 156, radius: 4.5 },
        { id: 'd', x: 92, y: 92, radius: 5 },
        { id: 'e', x: 136, y: 24, radius: 4 },
        { id: 'f', x: 162, y: 116, radius: 6 },
        { id: 'g', x: 188, y: 174, radius: 4.5 },
        { id: 'h', x: 220, y: 52, radius: 4.5 },
        { id: 'i', x: 252, y: 126, radius: 5 },
        { id: 'j', x: 294, y: 22, radius: 4 },
        { id: 'k', x: 340, y: 144, radius: 5.5 },
        { id: 'z', x: 276, y: 206, radius: 3.5 },
    ];
    const connections = [
        { from: 'aa', to: 'b', d: 'M74 -10C60 8 42 24 20 42', delay: 0.02 },
        { from: 'a', to: 'b', d: 'M-20 122C-6 86 4 58 20 42', delay: 0.06 },
        { from: 'a', to: 'c', d: 'M-20 122C6 130 30 144 56 156', delay: 0.16 },
        { from: 'b', to: 'd', d: 'M20 42C44 50 68 68 92 92', delay: 0.28 },
        { from: 'c', to: 'd', d: 'M56 156C68 128 76 108 92 92', delay: 0.38 },
        { from: 'd', to: 'e', d: 'M92 92C106 64 118 40 136 24', delay: 0.5 },
        { from: 'd', to: 'f', d: 'M92 92C116 96 138 104 162 116', delay: 0.62 },
        { from: 'e', to: 'h', d: 'M136 24C162 24 190 32 220 52', delay: 0.76 },
        { from: 'f', to: 'g', d: 'M162 116C172 136 178 154 188 174', delay: 0.88 },
        { from: 'f', to: 'h', d: 'M162 116C176 92 194 70 220 52', delay: 1.0 },
        { from: 'f', to: 'i', d: 'M162 116C190 112 218 116 252 126', delay: 1.12 },
        { from: 'g', to: 'i', d: 'M188 174C208 156 226 140 252 126', delay: 1.24 },
        { from: 'h', to: 'j', d: 'M220 52C242 42 266 30 294 22', delay: 1.36 },
        { from: 'i', to: 'k', d: 'M252 126C284 126 312 132 340 144', delay: 1.5 },
        { from: 'i', to: 'z', d: 'M252 126C260 154 268 182 276 206', delay: 1.62 },
    ];
    const signalConfigs = {
        0: { duration: 7.2, travelRatio: 0.7, offsets: [0.92, 0.58, 0.12, -0.04] },
        2: { duration: 7.8, travelRatio: 0.72, offsets: [0.82, 0.46, 0.08, -0.08] },
        4: { duration: 8.1, travelRatio: 0.68, offsets: [0.74, 0.38, 0.02, -0.14] },
        7: { duration: 7.3, travelRatio: 0.7, offsets: [0.96, 0.62, 0.18, 0] },
        10: { duration: 8.4, travelRatio: 0.74, offsets: [0.68, 0.3, -0.04, -0.18] },
        13: { duration: 7.8, travelRatio: 0.7, offsets: [0.88, 0.52, 0.12, -0.02] },
        14: { duration: 8.2, travelRatio: 0.72, offsets: [0.78, 0.4, 0.04, -0.12] },
    };
    const animatedConnections = new Set(Object.keys(signalConfigs).map(Number));
    const pulseId = `${prefix}-infra-pulse`;
    const trailBlurId = `${prefix}-infra-trail-blur`;
    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const connectionPaths = connections.map((connection) => ({
        ...connection,
        gradientId: `${prefix}-infra-trail-${connection.from}-${connection.to}`,
        d: connection.d ?? `M${nodeMap[connection.from].x} ${nodeMap[connection.from].y}L${nodeMap[connection.to].x} ${nodeMap[connection.to].y}`,
    }));
    const nodePulseEvents = connectionPaths.flatMap((connection, index) => {
        if (!animatedConnections.has(index)) {
            return [];
        }

        const config = signalConfigs[index];
        const duration = isActive ? config.duration : config.duration + 1.8;

        return [
            {
                key: `${index}-arrival`,
                nodeId: connection.to,
                delay: connection.delay + duration * config.travelRatio,
            },
        ];
    });

    return (
        <SignalFrame palette={palette} chips={chips}>
            <svg viewBox="0 0 320 192" className="relative h-full w-full" fill="none" aria-hidden="true">
                <defs>
                    {connectionPaths.map((connection) => (
                        <linearGradient
                            key={connection.gradientId}
                            id={connection.gradientId}
                            x1={nodeMap[connection.to].x}
                            y1={nodeMap[connection.to].y}
                            x2={nodeMap[connection.from].x}
                            y2={nodeMap[connection.from].y}
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor={palette.secondary} stopOpacity="0" />
                            <stop offset="0.28" stopColor={palette.secondary} stopOpacity="0.28" />
                            <stop offset="0.72" stopColor={palette.secondary} stopOpacity="0.88" />
                            <stop offset="1" stopColor={palette.primary} stopOpacity="1" />
                        </linearGradient>
                    ))}
                    <radialGradient id={pulseId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 132) rotate(90) scale(96 156)">
                        <stop stopColor={palette.glow} />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <filter id={trailBlurId} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.65" />
                    </filter>
                </defs>

                <rect x="-10" y="-10" width="340" height="212" fill={palette.soft} opacity="0.22" />
                <rect x="-10" y="-10" width="340" height="212" fill={`url(#${pulseId})`} />

                {connectionPaths.map((connection, index) => (
                    <g key={`connection-${index}`}>
                        <path
                            d={connection.d}
                            stroke={palette.primary}
                            strokeOpacity={0.09}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        {animatedConnections.has(index)
                            ? (() => {
                                  const config = signalConfigs[index];
                                  const duration = isActive ? config.duration : config.duration + 1.8;

                                  return (
                                      <motion.path
                                          d={connection.d}
                                          stroke={`url(#${connection.gradientId})`}
                                          strokeWidth="7.2"
                                          strokeLinecap="round"
                                          filter={`url(#${trailBlurId})`}
                                          initial={{ pathLength: 0.12, pathOffset: 1 }}
                                          animate={{
                                              pathOffset: config.offsets,
                                              pathLength: isActive ? [0.16, 0.28, 0.18, 0.18] : [0.13, 0.22, 0.14, 0.14],
                                              opacity: [0, 1, 0, 0],
                                          }}
                                          transition={{
                                              duration,
                                              delay: connection.delay,
                                              repeat: Infinity,
                                              ease: 'linear',
                                              times: [0, 0.56, 0.88, 1],
                                          }}
                                      />
                                  );
                              })()
                            : null}
                    </g>
                ))}

                {nodePulseEvents.map((event) => {
                    const node = nodeMap[event.nodeId];

                    return (
                        <motion.circle
                            key={`node-ring-${event.key}`}
                            cx={node.x}
                            cy={node.y}
                            r={node.radius + 9}
                            fill={palette.glow}
                            animate={{
                                scale: isActive ? [0.9, 1.42, 0.9] : [0.94, 1.26, 0.94],
                                opacity: [0, 0.18, 0],
                            }}
                            transition={{
                                duration: isActive ? 2.8 : 3.4,
                                delay: event.delay,
                                ...sharedTransition,
                            }}
                        />
                    );
                })}

                {nodePulseEvents.map((event) => {
                    const node = nodeMap[event.nodeId];

                    return (
                        <motion.circle
                            key={`node-flash-${event.key}`}
                            cx={node.x}
                            cy={node.y}
                            r={node.radius + 1.4}
                            fill={palette.secondary}
                            animate={{
                                scale: isActive ? [0.96, 1.06, 0.96] : [0.98, 1.03, 0.98],
                                opacity: [0, 0.14, 0],
                            }}
                            transition={{
                                duration: isActive ? 2.2 : 2.8,
                                delay: event.delay,
                                ...sharedTransition,
                            }}
                        />
                    );
                })}

                {nodes.map((node) => (
                    <motion.circle
                        key={`node-core-${node.id}`}
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={palette.primary}
                        animate={{
                            opacity: isActive ? [0.52, 0.72, 0.52] : [0.46, 0.62, 0.46],
                        }}
                        transition={{
                            duration: isActive ? 4.6 : 6,
                            ...sharedTransition,
                        }}
                    />
                ))}

                {nodes.map((node) => (
                    <circle
                        key={`node-center-${node.id}`}
                        cx={node.x}
                        cy={node.y}
                        r={node.radius - 2.4}
                        fill="white"
                        opacity="0.78"
                    />
                ))}
            </svg>
        </SignalFrame>
    );
}

function CreativeDirectionGlyph({ palette, isActive, prefix, chips }) {
    const orbitId = `${prefix}-creative-orbit`;

    return (
        <SignalFrame palette={palette} chips={chips}>
            <svg viewBox="0 0 320 192" className="relative h-full w-full" fill="none" aria-hidden="true">
                <defs>
                    <radialGradient id={orbitId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(160 96) rotate(90) scale(68 88)">
                        <stop stopColor={palette.glow} />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <rect x="-8" y="-8" width="336" height="208" fill={palette.soft} opacity="0.24" />
                <rect x="-8" y="-8" width="336" height="208" fill={`url(#${orbitId})`} />

                <motion.circle
                    cx="160"
                    cy="96"
                    r="18"
                    fill={palette.primary}
                    animate={{
                        scale: isActive ? [0.9, 1.08, 0.9] : [0.92, 1, 0.92],
                        opacity: [0.84, 1, 0.84],
                    }}
                    transition={{ duration: isActive ? 1.7 : 2.4, ...sharedTransition }}
                />

                {[46, 72, 98].map((radius, index) => (
                    <motion.circle
                        key={radius}
                        cx="160"
                        cy="96"
                        r={radius}
                        stroke={index === 0 ? palette.primary : palette.secondary}
                        strokeOpacity={index === 0 ? 0.32 : 0.18}
                        strokeWidth="1.5"
                        animate={{
                            scale: isActive ? [0.96, 1.02, 0.96] : [0.98, 1, 0.98],
                            opacity: isActive ? [0.24, 0.42, 0.24] : [0.16, 0.26, 0.16],
                        }}
                        transition={{
                            duration: 3.8 + index * 0.9,
                            delay: index * 0.18,
                            ...sharedTransition,
                        }}
                    />
                ))}

                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: isActive ? 8 : 12, repeat: Infinity, ease: 'linear' }}
                    style={{ originX: '160px', originY: '96px' }}
                >
                    <circle cx="160" cy="-2" r="6" fill={palette.secondary} />
                    <circle cx="240" cy="142" r="4" fill={palette.primary} opacity="0.8" />
                </motion.g>

                {[
                    {
                        key: 'wander-a',
                        x: [92, 110, 104, 84, 92],
                        y: [66, 54, 74, 82, 66],
                        r: 7,
                        delay: 0.12,
                        alpha: 0.42,
                    },
                    {
                        key: 'wander-b',
                        x: [228, 246, 238, 216, 228],
                        y: [58, 74, 94, 76, 58],
                        r: 5,
                        delay: 0.36,
                        alpha: 0.28,
                    },
                    {
                        key: 'wander-c',
                        x: [252, 234, 212, 228, 252],
                        y: [126, 136, 118, 98, 126],
                        r: 8,
                        delay: 0.22,
                        alpha: 0.32,
                    },
                    {
                        key: 'wander-d',
                        x: [84, 98, 120, 102, 84],
                        y: [138, 126, 142, 156, 138],
                        r: 4,
                        delay: 0.48,
                        alpha: 0.24,
                    },
                ].map((bubble) => (
                    <motion.circle
                        key={bubble.key}
                        cx={bubble.x[0]}
                        cy={bubble.y[0]}
                        r={bubble.r}
                        fill={palette.primary}
                        opacity={bubble.alpha}
                        animate={{
                            cx: bubble.x,
                            cy: bubble.y,
                            scale: isActive ? [1, 1.12, 0.98, 1.06, 1] : [1, 1.06, 0.99, 1.03, 1],
                            opacity: [bubble.alpha * 0.75, bubble.alpha, bubble.alpha * 0.75],
                        }}
                        transition={{
                            duration: isActive ? 6.2 : 8,
                            delay: bubble.delay,
                            ...sharedTransition,
                        }}
                    />
                ))}
            </svg>
        </SignalFrame>
    );
}

function InteractiveGlyph({ palette, isActive, prefix, chips }) {
    const screenId = `${prefix}-interactive-screen`;
    const viewportId = `${prefix}-interactive-viewport`;
    const loopDuration = isActive ? 8.4 : 10.8;
    const loopTransition = {
        duration: loopDuration,
        repeat: Infinity,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.14, 0.24, 0.46, 0.56, 0.78, 0.88, 1],
    };

    return (
        <SignalFrame palette={palette} chips={chips}>
            <svg viewBox="0 0 320 192" className="relative h-full w-full" fill="none" aria-hidden="true">
                <defs>
                    <radialGradient id={screenId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 132) rotate(180) scale(186 132)">
                        <stop stopColor={palette.glow} />
                        <stop offset="0.58" stopColor="rgba(127,231,255,0.09)" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id={viewportId}>
                        <rect x="8" y="6" width="304" height="180" />
                    </clipPath>
                </defs>

                <rect x="-8" y="-8" width="336" height="208" fill={palette.soft} opacity="0.22" />
                <rect x="-8" y="-8" width="336" height="208" fill={`url(#${screenId})`} />

                <g clipPath={`url(#${viewportId})`}>
                    <motion.g
                        animate={{
                            x: [44, 114, 122, 188, 196, 44, 38, 44],
                            y: [70, 44, 48, 70, 74, 70, 66, 70],
                            scale: [0.88, 1.08, 1.02, 0.88, 0.8, 0.88, 0.94, 0.88],
                            rotate: [-10, 4, 0, 10, 12, -10, -12, -10],
                            opacity: [0.5, 1, 0.96, 0.5, 0.34, 0.5, 0.66, 0.5],
                        }}
                        transition={loopTransition}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                        <rect x="0" y="0" width="92" height="82" rx="24" fill="rgba(255,255,255,0.84)" stroke={palette.primary} strokeOpacity="0.18" />
                        <circle cx="28" cy="28" r="8" fill={palette.primary} />
                        <path d="M44 26H68" stroke={palette.primary} strokeOpacity="0.58" strokeWidth="2.6" strokeLinecap="round" />
                        <path d="M22 54H66" stroke={palette.primary} strokeOpacity="0.22" strokeWidth="2.6" strokeLinecap="round" />
                    </motion.g>

                    <motion.g
                        animate={{
                            x: [114, 188, 196, 44, 38, 114, 122, 114],
                            y: [44, 70, 74, 70, 66, 44, 48, 44],
                            scale: [1, 0.88, 0.8, 0.88, 0.94, 1.08, 1.02, 1],
                            rotate: [0, 10, 12, -10, -12, 4, 0, 0],
                            opacity: [1, 0.5, 0.34, 0.5, 0.66, 1, 0.96, 1],
                        }}
                        transition={loopTransition}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                        <rect x="0" y="0" width="92" height="82" rx="24" fill="rgba(255,255,255,0.92)" stroke={palette.primary} strokeOpacity="0.18" />
                        <rect x="22" y="22" width="48" height="12" rx="6" fill="rgba(79,109,255,0.12)" />
                        <path d="M22 52H68" stroke={palette.primary} strokeOpacity="0.5" strokeWidth="2.6" strokeLinecap="round" />
                        <path d="M22 62H54" stroke={palette.primary} strokeOpacity="0.22" strokeWidth="2.6" strokeLinecap="round" />
                    </motion.g>

                    <motion.g
                        animate={{
                            x: [188, 44, 38, 114, 122, 188, 196, 188],
                            y: [70, 70, 66, 44, 48, 70, 74, 70],
                            scale: [0.88, 0.88, 0.94, 1.08, 1.02, 0.88, 0.8, 0.88],
                            rotate: [10, -10, -12, 4, 0, 10, 12, 10],
                            opacity: [0.5, 0.5, 0.66, 1, 0.96, 0.5, 0.34, 0.5],
                        }}
                        transition={loopTransition}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                        <rect x="0" y="0" width="92" height="82" rx="24" fill="rgba(255,255,255,0.8)" stroke={palette.primary} strokeOpacity="0.18" />
                        <rect x="22" y="22" width="18" height="18" rx="9" fill={palette.primary} opacity="0.72" />
                        <rect x="48" y="22" width="22" height="18" rx="9" fill="rgba(79,109,255,0.12)" />
                        <rect x="22" y="54" width="48" height="12" rx="6" fill="rgba(79,109,255,0.1)" />
                    </motion.g>
                </g>
            </svg>
        </SignalFrame>
    );
}

function VisualSystemGlyph({ palette, isActive, prefix, chips }) {
    const panelId = `${prefix}-visual-panel`;
    const barId = `${prefix}-visual-bar`;
    const typeClipId = `${prefix}-visual-type-clip`;
    const times = [0, 0.24, 0.5, 0.76, 1];
    const loopTransition = {
        duration: isActive ? 5.6 : 7.2,
        repeat: Infinity,
        ease: [0.24, 1, 0.36, 1],
        times,
    };
    const sliderXs = [84, 146, 222, 278, 84];
    const greenScale = ['#bfe8cf', '#8bdaa7', '#5fc983', '#2cab63', '#bfe8cf'];
    const greenStroke = ['#267149', '#1f7447', '#177144', '#0f6539', '#267149'];
    const rampOne = ['#d9f4e4', '#c8edd8', '#a7e2be', '#8ad6a8', '#d9f4e4'];
    const rampTwo = ['#a8ddb9', '#8fd3a5', '#63c587', '#46b970', '#a8ddb9'];
    const rampThree = ['#66c98a', '#45bb70', '#239f56', '#147f40', '#66c98a'];
    const rampDotXs = [218, 240, 262];
    const rampDotRadius = 5.5;
    const outlineWidths = [1.6, 2.2, 3.4, 4.6];
    const outlineOpacityKeyframes = [
        [1, 0.18, 0, 0, 1],
        [0, 0.88, 0.14, 0, 0],
        [0, 0, 0.9, 0.16, 0],
        [0, 0, 0, 0.96, 0],
    ];

    return (
        <SignalFrame palette={palette} chips={chips}>
            <svg viewBox="0 0 320 192" className="relative h-full w-full" fill="none" aria-hidden="true">
                <defs>
                    <radialGradient id={panelId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(246 142) rotate(180) scale(178 148)">
                        <stop stopColor={palette.glow} />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={barId} x1="36" y1="174" x2="284" y2="174" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8bd8aa" />
                        <stop offset="1" stopColor="#39a966" />
                    </linearGradient>
                    <clipPath id={typeClipId}>
                        <rect x="24" y="22" width="136" height="108" rx="28" />
                    </clipPath>
                </defs>

                <rect x="-8" y="-8" width="336" height="208" fill={palette.soft} opacity="0.22" />
                <rect x="-8" y="-8" width="336" height="208" fill={`url(#${panelId})`} />

                <rect x="24" y="22" width="136" height="108" rx="28" fill="rgba(255,255,255,0.52)" stroke="rgba(66, 123, 84, 0.08)" />
                <motion.rect
                    x="184"
                    y="22"
                    width="112"
                    height="62"
                    rx="24"
                    animate={{
                        fill: greenScale,
                        fillOpacity: [0.34, 0.46, 0.62, 0.76, 0.34],
                    }}
                    stroke="rgba(66, 123, 84, 0.08)"
                    strokeWidth="1"
                    transition={loopTransition}
                />
                <rect x="184" y="92" width="112" height="38" rx="19" fill="rgba(255,255,255,0.44)" stroke="rgba(66, 123, 84, 0.08)" />
                <rect x="24" y="148" width="272" height="28" rx="16" fill="rgba(255,255,255,0.5)" stroke="rgba(66, 123, 84, 0.08)" />

                <g clipPath={`url(#${typeClipId})`}>
                    {outlineWidths.map((width, index) => (
                        <motion.text
                            key={`outline-${width}`}
                            initial={false}
                            x="92"
                            y="79"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="58"
                            fontFamily="'Iowan Old Style', Georgia, serif"
                            fontWeight="500"
                            fill="none"
                            stroke={greenStroke[0]}
                            strokeWidth={width}
                            strokeLinejoin="round"
                            animate={{
                                stroke: greenStroke,
                                opacity: outlineOpacityKeyframes[index],
                            }}
                            transition={loopTransition}
                        >
                            A
                        </motion.text>
                    ))}
                    <motion.text
                        initial={false}
                        x="92"
                        y="79"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="58"
                        fontFamily="'Iowan Old Style', Georgia, serif"
                        fontWeight="500"
                        fill={greenScale[0]}
                        animate={{
                            fill: greenScale,
                        }}
                        transition={loopTransition}
                    >
                        A
                    </motion.text>
                </g>

                {[0, 1, 2].map((index) => {
                    const cx = rampDotXs[index];
                    const fills = index === 0 ? rampOne : index === 1 ? rampTwo : rampThree;

                    return (
                        <motion.circle
                            key={`ramp-${index}`}
                            cx={cx}
                            cy="111"
                            r={rampDotRadius}
                            animate={{
                                fill: fills,
                            }}
                            transition={loopTransition}
                        />
                    );
                })}

                <path d="M38 162H282" stroke="rgba(61, 137, 86, 0.16)" strokeWidth="4" strokeLinecap="round" />
                <motion.path
                    d="M38 162H282"
                    stroke={`url(#${barId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{ opacity: [0.68, 0.94, 1, 0.88, 0.68] }}
                    transition={loopTransition}
                />
                <motion.circle
                    cy="162"
                    r="7.5"
                    fill="#5dcb82"
                    stroke="#197245"
                    strokeWidth="1.5"
                    animate={{ cx: sliderXs, scale: [1, 1.08, 1.2, 1.1, 1] }}
                    transition={loopTransition}
                />
                <motion.circle
                    cy="162"
                    r="15"
                    fill="rgba(95, 201, 131, 0.16)"
                    animate={{ cx: sliderXs, scale: [0.9, 1.1, 1.32, 1.16, 0.9], opacity: [0.22, 0.28, 0.42, 0.26, 0.22] }}
                    transition={loopTransition}
                />
            </svg>
        </SignalFrame>
    );
}

export default function ServiceGlyph({ serviceId, isActive = false, chips = [] }) {
    const prefix = useId().replace(/:/g, '');
    const palette = palettes[serviceId] ?? palettes[1];

    if (serviceId === 2) {
        return <CreativeDirectionGlyph palette={palette} isActive={isActive} prefix={prefix} chips={chips} />;
    }

    if (serviceId === 3) {
        return <InteractiveGlyph palette={palette} isActive={isActive} prefix={prefix} chips={chips} />;
    }

    if (serviceId === 4) {
        return <VisualSystemGlyph palette={palette} isActive={isActive} prefix={prefix} chips={chips} />;
    }

    return <InfrastructureGlyph palette={palette} isActive={isActive} prefix={prefix} chips={chips} />;
}
