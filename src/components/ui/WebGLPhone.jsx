import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function WebGLPhone({ activeService, screenStyles, suspendPlayback, className = '', style = {} }) {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const screenMaterialsRef = useRef([]);
    const targetOpacitiesRef = useRef([1, 0, 0, 0]);

    // Handle incoming prop changes dynamically on the WebGL materials 
    // without triggering React re-renders or breaking the Three.js loop
    useEffect(() => {
        const activeIndex = Math.max(0, activeService - 1);
        for (let i = 0; i < targetOpacitiesRef.current.length; i++) {
            targetOpacitiesRef.current[i] = (i === activeIndex) ? 1 : 0;
        }
    }, [activeService]);

    useEffect(() => {
        // Suspend/Resume videos on demand
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            const activeIndex = Math.max(0, activeService - 1);
            if (!suspendPlayback && index === activeIndex) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, [activeService, suspendPlayback]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // --- 1. Basic Scene Setup ---
        const scene = new THREE.Scene();
        
        const initialW = container.clientWidth || 523;
        const initialH = container.clientHeight || 794;
        
        const camera = new THREE.PerspectiveCamera(40, initialW / initialH, 0.1, 100);
        camera.position.set(0, 0, 13.5);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(initialW, initialH);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace; // R152+ syntax
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;

        renderer.domElement.style.outline = 'none';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.position = 'absolute'; // Critical for stopping intrinsic high-res canvas from inflating layout
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';

        container.appendChild(renderer.domElement);

        // --- 2. Procedural Studio Environment Map ---
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        
        const envScene = new THREE.Scene();
        
        function createSoftSoftbox(colorHex) {
            const c = document.createElement("canvas");
            c.width = 512;
            c.height = 512;
            const ctx = c.getContext("2d");
            const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            g.addColorStop(0, colorHex);
            g.addColorStop(0.4, colorHex);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 512);
            
            const tex = new THREE.CanvasTexture(c);
            tex.colorSpace = THREE.SRGBColorSpace; // CRITICAL: explicit decode for physical env reflection
            return tex;
        }

        const whiteSoftMat = new THREE.MeshBasicMaterial({ map: createSoftSoftbox('rgba(255,255,255,1)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
        const cyanSoftMat = new THREE.MeshBasicMaterial({ map: createSoftSoftbox('rgba(0,240,255,0.8)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

        const panel1 = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), whiteSoftMat);
        panel1.position.set(-15, 10, 15);
        panel1.lookAt(0,0,0);
        envScene.add(panel1);
        
        const panel2 = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), whiteSoftMat);
        panel2.position.set(15, -10, 15);
        panel2.lookAt(0,0,0);
        envScene.add(panel2);
        
        const panel3 = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), cyanSoftMat); 
        panel3.position.set(0, 20, -20);
        panel3.lookAt(0,0,0);
        envScene.add(panel3);
        
        const renderTarget = pmremGenerator.fromScene(envScene);
        scene.environment = renderTarget.texture;

        // Restore blind photometric match to the prototype lighting ratios
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight.position.set(5, 5, 5);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
        rimLight.position.set(-5, 0, -5);
        scene.add(rimLight);

        // --- 3. High-Fidelity Geometry Builders ---
        const phoneGroup = new THREE.Group();

        function createRoundedRectShape(w, h, r) {
            const shape = new THREE.Shape();
            shape.moveTo(-w/2 + r, h/2);
            shape.lineTo(w/2 - r, h/2);
            shape.quadraticCurveTo(w/2, h/2, w/2, h/2 - r);
            shape.lineTo(w/2, -h/2 + r);
            shape.quadraticCurveTo(w/2, -h/2, w/2 - r, -h/2);
            shape.lineTo(-w/2 + r, -h/2);
            shape.quadraticCurveTo(-w/2, -h/2, -w/2, -h/2 + r);
            shape.lineTo(-w/2, h/2 - r);
            shape.quadraticCurveTo(-w/2, h/2, -w/2 + r, h/2);
            return shape;
        }
        
        function createPillShape(w, h) {
            const shape = new THREE.Shape();
            const r = w/2;
            shape.moveTo(-w/2, h/2 - r);
            shape.absarc(0, h/2 - r, r, Math.PI, 0, true);
            shape.lineTo(w/2, -h/2 + r);
            shape.absarc(0, -h/2 + r, r, 0, Math.PI, true);
            shape.lineTo(-w/2, h/2 - r);
            return shape;
        }

        const w = 3.6;
        const h = 7.4;
        const d = 0.28; 
        const chassisR = 0.45; 
        
        const chassisShape = createRoundedRectShape(w, h, chassisR);
        const extrudeSettings = {
            depth: d,
            bevelEnabled: true,
            bevelSegments: 8, 
            steps: 1,
            bevelSize: 0.025,  
            bevelThickness: 0.025,
            curveSegments: 64 
        };

        const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
        chassisGeo.center(); 
        
        const metalMat = new THREE.MeshStandardMaterial({
            color: 0x444444, 
            roughness: 0.35, 
            metalness: 1.0,  
            envMapIntensity: 2.5 // Extrapolated for physical envMap response
        });
        
        const chassisMesh = new THREE.Mesh(chassisGeo, metalMat);
        phoneGroup.add(chassisMesh);

        // --- 4. Machined Tactical Buttons ---
        const btnShape = createPillShape(0.12, 0.8);
        const btnExtrude = { depth: 0.1, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.015, bevelThickness: 0.015, curveSegments: 32 };
        const btnGeo = new THREE.ExtrudeGeometry(btnShape, btnExtrude);
        btnGeo.center();
        
        const btnMat = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.3,
            metalness: 0.9,
            envMapIntensity: 1.0
        });
        
        const powerBtn = new THREE.Mesh(btnGeo, btnMat);
        powerBtn.position.set(w/2 + 0.02, 0.8, 0); 
        powerBtn.rotation.y = Math.PI / 2;
        phoneGroup.add(powerBtn);

        const volUpBtn = new THREE.Mesh(btnGeo, btnMat);
        volUpBtn.position.set(-w/2 - 0.02, 1.2, 0);
        volUpBtn.rotation.y = -Math.PI / 2;
        phoneGroup.add(volUpBtn);

        const volDownBtn = new THREE.Mesh(btnGeo, btnMat);
        volDownBtn.position.set(-w/2 - 0.02, 0.3, 0);
        volDownBtn.rotation.y = -Math.PI / 2;
        phoneGroup.add(volDownBtn);

        // --- Neon Indicator Slit (Right Side + Light Trail Shader) ---
        const neonSlitGeo = new THREE.PlaneGeometry(0.04, 2.6); 
        const neonSlitMat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                neonColor: { value: new THREE.Color(0x00f0ff) },
                baseColor: { value: new THREE.Color(0x040404) } 
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vUv = uv;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    vNormal = normalize(normalMatrix * normal);
                    vViewPosition = -mvPosition.xyz;
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 neonColor;
                uniform vec3 baseColor;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    float fillLevel = (sin(time * 0.5) * 0.5) + 0.5; 
                    float glow = smoothstep(fillLevel + 0.1, fillLevel - 0.1, vUv.y);
                    float insetX = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
                    float insetY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
                    
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewPosition);
                    float viewDot = dot(normal, viewDir);
                    float antiAliasFade = smoothstep(0.15, 0.4, viewDot);
                    
                    vec3 col = mix(baseColor, neonColor * 1.5, glow * insetX * insetY * antiAliasFade);
                    gl_FragColor = vec4(col, 1.0);
                }
            `
        });
        const neonSlit = new THREE.Mesh(neonSlitGeo, neonSlitMat);
        neonSlit.position.set(w/2 + 0.0402, -1.2, 0); 
        neonSlit.rotation.y = Math.PI / 2;
        phoneGroup.add(neonSlit);

        // --- Bottom Ports (USB-C & Speaker Grills) ---
        const bottomPortsGroup = new THREE.Group();
        bottomPortsGroup.position.set(0, -3.741, 0); 
        bottomPortsGroup.rotation.x = Math.PI / 2; 
        phoneGroup.add(bottomPortsGroup);

        const portHoleMat = new THREE.MeshBasicMaterial({ color: 0x010101 });
        const usbPinMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.5 });

        const usbGeo = new THREE.ShapeGeometry(createRoundedRectShape(0.40, 0.12, 0.06), 32);
        const usbMesh = new THREE.Mesh(usbGeo, portHoleMat);
        bottomPortsGroup.add(usbMesh);

        const usbPinGeo = new THREE.ShapeGeometry(createRoundedRectShape(0.24, 0.02, 0.01), 16);
        const usbPinMesh = new THREE.Mesh(usbPinGeo, usbPinMat);
        usbPinMesh.position.set(0, 0, 0.005);
        bottomPortsGroup.add(usbPinMesh);

        const grillGeo = new THREE.CircleGeometry(0.04, 32);
        const grillSpacing = 0.20;
        const grillOffsetCenter = 0.65;

        for (let i = 0; i < 4; i++) {
            const grillL = new THREE.Mesh(grillGeo, portHoleMat);
            grillL.position.set(-grillOffsetCenter - (i * grillSpacing), 0, 0);
            bottomPortsGroup.add(grillL);

            const grillR = new THREE.Mesh(grillGeo, portHoleMat);
            grillR.position.set(grillOffsetCenter + (i * grillSpacing), 0, 0);
            bottomPortsGroup.add(grillR);
        }

        // --- 5. True Physical Screen Glass ---
        const innerW = w - 0.18; 
        const innerH = h - 0.18;
        const innerR = chassisR - 0.09;
        const innerShape = createRoundedRectShape(innerW, innerH, innerR);
        
        const faceZ = (d + extrudeSettings.bevelThickness * 2) / 2; 

        // --- 6. The Screen Layer (Dynamic WebGL Textures) ---
        const screenGeo = new THREE.ShapeGeometry(innerShape, 64);
        const posAttribute = screenGeo.attributes.position;
        const uvs = [];
        for (let i = 0; i < posAttribute.count; i++) {
            const px = posAttribute.getX(i);
            const py = posAttribute.getY(i);
            uvs.push( (px + innerW/2) / innerW, (py + innerH/2) / innerH );
        }
        screenGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const tl = new THREE.TextureLoader();
        const screenLayers = [];

        function applyObjectFitCover(tex, imgW, imgH) {
            const imageAspect = imgW / imgH;
            const screenAspect = innerW / innerH;
            let scaleX = 1;
            let scaleY = 1;
            if (imageAspect > screenAspect) {
                // Image is wider, pad sides
                scaleX = screenAspect / imageAspect;
            } else {
                // Image is taller, pad top/bottom
                scaleY = imageAspect / screenAspect;
            }
            tex.repeat.set(scaleX, scaleY);
            tex.offset.set((1 - scaleX) / 2, (1 - scaleY) / 2);
        }

        screenStyles.forEach((style, index) => {
            let tex = null;
            if (style.image) {
                tex = tl.load(style.image, (loadedTex) => {
                    loadedTex.colorSpace = THREE.SRGBColorSpace; // MUST be SRGB to prevent double-gamma washout!
                    if (loadedTex.image) {
                        applyObjectFitCover(loadedTex, loadedTex.image.width, loadedTex.image.height);
                        loadedTex.needsUpdate = true;
                    }
                });
                // Optimistically set to SRGB so the first frame doesn't load washed out while waiting
                tex.colorSpace = THREE.SRGBColorSpace;
            } else if (style.video && videoRefs.current[index]) {
                const vid = videoRefs.current[index];
                tex = new THREE.VideoTexture(vid);
                tex.colorSpace = THREE.SRGBColorSpace; // MUST be SRGB to prevent double-gamma washout!
                
                const fitVideo = () => {
                    applyObjectFitCover(tex, vid.videoWidth, vid.videoHeight);
                    tex.needsUpdate = true;
                };

                if (vid.readyState >= 1) {
                    fitVideo();
                } else {
                    vid.addEventListener('loadedmetadata', fitVideo);
                }
            }

            const mat = new THREE.MeshPhysicalMaterial({
                emissiveMap: tex,
                emissive: 0xffffff,
                emissiveIntensity: 0.8, 
                color: 0xffffff, 
                metalness: 0.1,
                roughness: 0.2,
                envMapIntensity: 0.8,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: index === 0 ? 1 : 0,
                depthWrite: false
            });
            
            const mesh = new THREE.Mesh(screenGeo, mat);
            mesh.position.set(0, 0, faceZ + 0.005);
            // Higher index = renders later (on top) 
            mesh.renderOrder = index; 
            
            phoneGroup.add(mesh);
            screenLayers.push(mat);
            screenMaterialsRef.current.push(mat);
        });

        // Removed erroneous top glass coat that was acting as a 70% black ND filter over the screens

        // Render Top hardware bezel frame cutout 
        const bezelCanvas = document.createElement('canvas');
        bezelCanvas.width = 1024;
        bezelCanvas.height = Math.round(1024 * (innerH / innerW));
        const bx = bezelCanvas.getContext('2d');
        bx.clearRect(0, 0, bezelCanvas.width, bezelCanvas.height);
        bx.fillStyle = '#0a0a0a';
        bx.roundRect = function(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.beginPath();
            this.moveTo(x + r, y);
            this.arcTo(x + w, y,   x + w, y + h, r);
            this.arcTo(x + w, y + h, x,   y + h, r);
            this.arcTo(x,   y + h, x,   y,   r);
            this.arcTo(x,   y,   x + w, y,   r);
            this.closePath();
            this.fill();
        }
        bx.roundRect(512 - (240 / 2), 40, 240, 70, 35); // Shifted UP and adjusted to perfect rounded proportion
        
        // Lens reflection mock on the front island
        bx.fillStyle = "#111111";
        bx.beginPath();
        bx.arc(592, 75, 13, 0, Math.PI * 2);
        bx.fill();
        bx.fillStyle = "#223355";
        bx.beginPath();
        bx.arc(594, 73, 4.5, 0, Math.PI * 2);
        bx.fill();

        const bezelTex = new THREE.CanvasTexture(bezelCanvas);
        bezelTex.colorSpace = THREE.SRGBColorSpace;
        
        const bezelGeo = new THREE.PlaneGeometry(innerW, innerH);
        const bezelMat = new THREE.MeshPhysicalMaterial({ 
            map: bezelTex, 
            transparent: true, 
            opacity: 1, 
            depthWrite: false, 
            metalness: 0.1, 
            roughness: 0.2, 
            envMapIntensity: 0.8, 
            clearcoat: 1.0, 
            clearcoatRoughness: 0.1,
            // To ensure only the drawn pill reflects and not the fully transparent screen parts, we rely on the alpha threshold
            alphaTest: 0.01
        });
        const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
        bezelMesh.position.set(0, 0, faceZ + 0.007);
        bezelMesh.renderOrder = 99; // Always absolute top
        phoneGroup.add(bezelMesh);


        // --- 7. Future Retro Bento Camera Visor ---
        const backGroup = new THREE.Group();
        backGroup.position.set(0, 0, -faceZ - 0.005);
        backGroup.rotation.y = Math.PI; 
        phoneGroup.add(backGroup);

        const amapCanvas = document.createElement("canvas");
        amapCanvas.width = 1024;
        amapCanvas.height = Math.round(1024 * (innerH / innerW));
        const cx = amapCanvas.getContext("2d");
        cx.fillStyle = "#000000";
        cx.fillRect(0, 0, amapCanvas.width, amapCanvas.height);
        cx.fillStyle = "#ffffff";
        cx.beginPath();
        cx.roundRect(0, 0, amapCanvas.width, amapCanvas.height, (innerR / innerW) * 1024);
        cx.fill();
        const alphaTex = new THREE.CanvasTexture(amapCanvas);

        const backPanelMat = new THREE.MeshStandardMaterial({
            color: 0x141414, roughness: 0.9, metalness: 0.4, envMapIntensity: 0.5,
            alphaMap: alphaTex, alphaTest: 0.5 
        });

        const backPanelGeo = new THREE.PlaneGeometry(innerW, innerH, 128, 256);
        const posA = backPanelGeo.attributes.position;
        function sdRoundRect(x, y, w, h, r) {
            const dx = Math.abs(x) - (w / 2) + r;
            const dy = Math.abs(y) - (h / 2) + r;
            const len = Math.sqrt(Math.max(dx, 0)**2 + Math.max(dy, 0)**2);
            return len + Math.min(Math.max(dx, dy), 0) - r;
        }

        const islandW = 3.1; const islandH = 1.6;
        const islandR = innerR; 
        const visorY = 2.65; 
        const islandHeight = 0.06;
        const slopeWidth = 0.12;   
        
        for(let i = 0; i < posA.count; i++) {
            const vx = posA.getX(i);
            const vy = posA.getY(i);
            let vz = 0;
            const distToIsland = Math.max(0, sdRoundRect(vx, vy - visorY, islandW, islandH, islandR));
            if (distToIsland === 0) { vz = islandHeight; } 
            else if (distToIsland <= slopeWidth) {
                const t = distToIsland / slopeWidth;
                vz = ((1.0 + Math.cos(t * Math.PI)) / 2.0) * islandHeight; 
            }
            posA.setZ(i, vz);
        }
        backPanelGeo.computeVertexNormals();
        const backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
        backPanel.position.set(0, 0, 0.015);
        backGroup.add(backPanel);
        
        const deckZ = 0.015 + islandHeight;

        const lensGlassMat = new THREE.MeshPhysicalMaterial({
            color: 0x020202, metalness: 0.2, roughness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.0, envMapIntensity: 3.0 
        });
        const lensRimMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.9 });

        const bigLensGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.04, 64);
        const bigLensGlassGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.05, 64);
        const leftBumpX = -1.1; 
        const topLensY = visorY + 0.40;
        const botLensY = visorY - 0.40;
        
        const topLensRim = new THREE.Mesh(bigLensGeo, lensRimMat);
        topLensRim.rotation.x = Math.PI / 2;
        topLensRim.position.set(leftBumpX, topLensY, deckZ + 0.02);
        backGroup.add(topLensRim);

        const topLensGlass = new THREE.Mesh(bigLensGlassGeo, lensGlassMat);
        topLensGlass.rotation.x = Math.PI / 2;
        topLensGlass.position.set(leftBumpX, topLensY, deckZ + 0.02);
        backGroup.add(topLensGlass);

        const neonRingGeo = new THREE.RingGeometry(0.14, 0.16, 32);
        const neonRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
        neonRing.position.set(leftBumpX, topLensY, deckZ + 0.046); 
        backGroup.add(neonRing);

        const bottomLensRim = new THREE.Mesh(bigLensGeo, lensRimMat);
        bottomLensRim.rotation.x = Math.PI / 2;
        bottomLensRim.position.set(leftBumpX, botLensY, deckZ + 0.02);
        backGroup.add(bottomLensRim);

        const bottomLensGlass = new THREE.Mesh(bigLensGlassGeo, lensGlassMat);
        bottomLensGlass.rotation.x = Math.PI / 2;
        bottomLensGlass.position.set(leftBumpX, botLensY, deckZ + 0.02);
        backGroup.add(bottomLensGlass);

        const smallLensGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32);
        const smallLensGlassGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 32);
        const midBumpX = leftBumpX + 0.45; 

        const thirdLensRim = new THREE.Mesh(smallLensGeo, lensRimMat);
        thirdLensRim.rotation.x = Math.PI / 2;
        thirdLensRim.position.set(midBumpX, visorY, deckZ + 0.02);
        backGroup.add(thirdLensRim);

        const thirdLensGlass = new THREE.Mesh(smallLensGlassGeo, lensGlassMat);
        thirdLensGlass.rotation.x = Math.PI / 2;
        thirdLensGlass.position.set(midBumpX, visorY, deckZ + 0.02);
        backGroup.add(thirdLensGlass);

        // 2. Future Retro 8-Bit LED Matrix (Ultra-Wide Bento Screen)
        const matrixW = 1.8;
        const matrixH = 1.35;
        const matrixShape = createRoundedRectShape(matrixW, matrixH, 0.2); 
        const matrixGeo = new THREE.ShapeGeometry(matrixShape, 64);
        
        const mPosA = matrixGeo.attributes.position;
        const mUvs = [];
        for (let i = 0; i < mPosA.count; i++) {
            const px = mPosA.getX(i);
            const py = mPosA.getY(i);
            mUvs.push((px + matrixW/2) / matrixW, (py + matrixH/2) / matrixH);
        }
        matrixGeo.setAttribute('uv', new THREE.Float32BufferAttribute(mUvs, 2));

        const matrixCanvas = document.createElement("canvas");
        matrixCanvas.width = 96; 
        matrixCanvas.height = 64;
        const matrixCtx = matrixCanvas.getContext("2d");
        const matrixTex = new THREE.CanvasTexture(matrixCanvas);
        matrixTex.minFilter = THREE.LinearFilter; 
        matrixTex.magFilter = THREE.LinearFilter;
        matrixTex.colorSpace = THREE.SRGBColorSpace;

        const matrixMat = new THREE.MeshPhysicalMaterial({
            map: matrixTex,
            emissiveMap: matrixTex,
            emissive: 0xffffff,
            emissiveIntensity: 3.0, 
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.1,
            clearcoat: 1.0,   
            clearcoatRoughness: 0.0,
            envMapIntensity: 2.0
        });

        const matrixMesh = new THREE.Mesh(matrixGeo, matrixMat);
        matrixMesh.position.set(0.55, visorY, deckZ + 0.016);
        backGroup.add(matrixMesh);

        scene.add(phoneGroup);

        // --- 9. OrbitControls Configuration ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.04; 
        controls.enableZoom = false; 
        controls.enablePan = false;
        controls.autoRotate = true; 
        controls.autoRotateSpeed = 1.2;

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            if (w === 0 || h === 0) return; // Prevent WebGL canvas from collapsing to 0x0 and glitching
            
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        // Define pixel art frames for the animated back screen
        const animFrames = [
            ["........", "..X..X..", "........", "........", ".X....X.", "..XXXX..", "........", "........"],
            [".X....XX", ".X....X.", ".XXXXXX.", "XX.XX.X.", "X.XXXXX.", "XXXXXXX.", ".X.XX.X.", ".X....X."],
            ["...XX...", "....X...", "........", ".XXXXX..", ".X...XX.", ".X...XX.", ".XXXXX..", "........"],
            ["........", ".XX..XX.", "X..XX..X", "X......X", ".X....X.", "..X..X..", "...XX...", "........"]
        ];

        // --- 10. Render Loop ---
        let reqId;
        function animate() {
            reqId = requestAnimationFrame(animate);

            controls.update(); 
            
            const timeSec = performance.now() * 0.001; 
            rimLight.intensity = 3.5 + Math.sin(timeSec * 2.0) * 1.5;

            if (neonSlitMat.uniforms) {
                neonSlitMat.uniforms.time.value = timeSec;
            }

            // Draw to the retro LED matrix on the back of the phone
            matrixCtx.fillStyle = "#020000"; 
            matrixCtx.fillRect(0, 0, 96, 64);
            matrixCtx.shadowBlur = 8;
            matrixCtx.shadowColor = "#ff6b35";
            const frameIndex = Math.floor(timeSec * 0.5) % animFrames.length;
            const currentFrame = animFrames[frameIndex];
            matrixCtx.fillStyle = "#ff6b35"; 
            const isBlinking = (Math.floor(timeSec * 5) % 15 === 0);
            for (let y = 0; y < 8; y++) {
                const row = currentFrame[y];
                for (let x = 0; x < 8; x++) {
                    if (row[x] === 'X') {
                        if (frameIndex === 0 && isBlinking && y === 1) continue; 
                        matrixCtx.fillRect(x * 6 + 25, y * 6 + 9, 4, 4); 
                    }
                }
            }
            matrixCtx.shadowBlur = 0;
            matrixTex.needsUpdate = true;

            // Lerp active screen opacities
            screenMaterialsRef.current.forEach((mat, i) => {
                const target = targetOpacitiesRef.current[i];
                if (mat.opacity !== target) {
                    mat.opacity += (target - mat.opacity) * 0.1; // Smooth GSAP-less lerp crossfade
                    if (Math.abs(mat.opacity - target) < 0.005) {
                        mat.opacity = target;
                    }
                }
            });

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            cancelAnimationFrame(reqId);
            resizeObserver.disconnect();
            renderer.dispose();
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            screenMaterialsRef.current = [];
        };
    }, [screenStyles]); // Run strictly once to prevent WebGL memory dupes. Opacity driven by ref updates.

    return (
        <div className={`relative w-full h-full ${className}`} style={style}>
            <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing" />
            
            {/* Hidden Video Data Store */}
            <div className="hidden">
                {screenStyles.map((item, i) => (
                    item.video ? (
                        <video
                            key={i}
                            ref={el => (videoRefs.current[i] = el)}
                            src={item.video}
                            crossOrigin="anonymous"
                            playsInline
                            loop
                            muted
                        />
                    ) : null
                ))}
            </div>
        </div>
    );
}
