/* ==========================================================================
   MANUELLA STUDIO — 3D WEBGL ENGINE (WARM LUXURY DOMAIN MODELS)
   ========================================================================== */

(function() {
    'use strict';

    // 1. SCENE SETUP & GLOBALS
    const container = document.getElementById('webgl-container');
    if (!container || typeof THREE === 'undefined') return;

    let scene, camera, renderer;
    
    // Domain Models
    let photoLensGroup;    // 3D Camera Lens & Photo Frame
    let videoFilmGroup;    // 3D Cinema Film Reel & Slate
    let webBrowserGroup;   // 3D Glass Web Browser Viewport
    let particleSystem;
    
    let lightCopper, lightGold, lightViolet;

    // Mouse tracking for spatial inertia
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // 2. INITIALIZE THREE.JS
    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0d0b14, 0.035);

        // Camera
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 13);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
        container.appendChild(renderer.domElement);

        // Lighting Rig with Warm Palette
        createLighting();

        // 3D Domain Models
        createCameraLensModel();    // Photo Studio (Camera Lens + Aperture)
        createFilmReelModel();      // Video Studio (Film Spool + Slate)
        createBrowserWindowModel(); // Web Design (Glass Browser + Wireframe UI)
        createParticleDust();       // Warm Ambient Atmosphere

        // Events
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mousemove', onMouseMove, false);

        // GSAP ScrollTrigger Integration
        initScrollAnimations();

        // Animation Loop
        animate();
    }

    // 3. WARM LIGHTING RIG
    function createLighting() {
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.95);
        scene.add(ambientLight);

        // Warm Copper Light
        lightCopper = new THREE.PointLight(0xe07a5f, 4.5, 35);
        lightCopper.position.set(-6, 4, 7);
        scene.add(lightCopper);

        // Warm Gold Light
        lightGold = new THREE.PointLight(0xf59e0b, 4.0, 35);
        lightGold.position.set(6, -4, 5);
        scene.add(lightGold);

        // Soft Amethyst Light
        lightViolet = new THREE.PointLight(0x8b5cf6, 2.5, 30);
        lightViolet.position.set(0, 7, -4);
        scene.add(lightViolet);
    }

    // 4. MODEL 1: PHOTO EDITING (3D CAMERA LENS & APERTURE)
    function createCameraLensModel() {
        photoLensGroup = new THREE.Group();

        // Barrel Cylinder
        const barrelGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 32);
        const barrelMat = new THREE.MeshStandardMaterial({
            color: 0x1c172a,
            metalness: 0.85,
            roughness: 0.2
        });
        const barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
        barrelMesh.rotation.x = Math.PI / 2;
        photoLensGroup.add(barrelMesh);

        // Metallic Warm Copper Ring
        const ringGeo = new THREE.TorusGeometry(1.9, 0.12, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xe07a5f,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xe07a5f,
            emissiveIntensity: 0.4
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        photoLensGroup.add(ringMesh);

        // Glass Lens Element
        const glassGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xf59e0b,
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.9,
            thickness: 0.8,
            transparent: true,
            opacity: 0.85
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.z = 0.5;
        glassMesh.rotation.x = Math.PI / 2;
        photoLensGroup.add(glassMesh);

        // Photo Frame Slab behind lens
        const frameGeo = new THREE.BoxGeometry(3.2, 2.2, 0.08);
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            wireframe: true,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.5
        });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.set(0.5, 0, -1.2);
        photoLensGroup.add(frameMesh);

        photoLensGroup.position.set(4.8, 1.2, 0);
        scene.add(photoLensGroup);
    }

    // 5. MODEL 2: VIDEO EDITING (3D FILM REEL & SLATE)
    function createFilmReelModel() {
        videoFilmGroup = new THREE.Group();

        // Main Film Spool Center Cylinder
        const spoolGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.4, 32);
        const spoolMat = new THREE.MeshStandardMaterial({
            color: 0x141120,
            metalness: 0.8,
            roughness: 0.3
        });
        const spoolMesh = new THREE.Mesh(spoolGeo, spoolMat);
        spoolMesh.rotation.x = Math.PI / 2;
        videoFilmGroup.add(spoolMesh);

        // Spool Rim Outer Ring
        const rimGeo = new THREE.TorusGeometry(2.3, 0.1, 16, 32);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.45
        });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        videoFilmGroup.add(rimMesh);

        // Film Tape Ribbon
        const tapeGeo = new THREE.TorusKnotGeometry(2.5, 0.15, 100, 16, 1, 3);
        const tapeMat = new THREE.MeshStandardMaterial({
            color: 0xe07a5f,
            wireframe: true,
            transparent: true,
            opacity: 0.75
        });
        const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
        videoFilmGroup.add(tapeMesh);

        // Clapperboard Plate
        const clapperGeo = new THREE.BoxGeometry(2.6, 1.8, 0.1);
        const clapperMat = new THREE.MeshStandardMaterial({
            color: 0xe07a5f,
            wireframe: true,
            emissive: 0xe07a5f,
            emissiveIntensity: 0.4
        });
        const clapperMesh = new THREE.Mesh(clapperGeo, clapperMat);
        clapperMesh.position.set(-1.2, 1.2, 0.5);
        clapperMesh.rotation.z = -0.3;
        videoFilmGroup.add(clapperMesh);

        videoFilmGroup.position.set(-5.2, -1.8, -1.5);
        scene.add(videoFilmGroup);
    }

    // 6. MODEL 3: WEB DESIGN (3D BROWSER VIEWPORT & UI)
    function createBrowserWindowModel() {
        webBrowserGroup = new THREE.Group();

        // Outer Glass Window
        const windowGeo = new THREE.BoxGeometry(5.5, 3.6, 0.15);
        const windowMat = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.85,
            transparent: true,
            opacity: 0.8,
            clearcoat: 1.0
        });
        const windowMesh = new THREE.Mesh(windowGeo, windowMat);
        webBrowserGroup.add(windowMesh);

        // Control Dots
        const dotGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const redDot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
        const yellowDot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
        const greenDot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0x10b981 }));

        redDot.position.set(-2.3, 1.5, 0.1);
        yellowDot.position.set(-2.0, 1.5, 0.1);
        greenDot.position.set(-1.7, 1.5, 0.1);

        webBrowserGroup.add(redDot);
        webBrowserGroup.add(yellowDot);
        webBrowserGroup.add(greenDot);

        // UI Grid Slabs floating inside
        const heroBlockGeo = new THREE.BoxGeometry(3.5, 1.2, 0.08);
        const heroBlockMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            wireframe: true,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.5
        });
        const heroBlock = new THREE.Mesh(heroBlockGeo, heroBlockMat);
        heroBlock.position.set(0.5, 0.4, 0.2);
        webBrowserGroup.add(heroBlock);

        for (let i = 0; i < 3; i++) {
            const cardGeo = new THREE.BoxGeometry(1.2, 0.9, 0.06);
            const cardMat = new THREE.MeshStandardMaterial({
                color: 0xe07a5f,
                wireframe: true,
                emissive: 0xe07a5f,
                emissiveIntensity: 0.4
            });
            const cardMesh = new THREE.Mesh(cardGeo, cardMat);
            cardMesh.position.set(-1.6 + (i * 1.6), -0.9, 0.2);
            webBrowserGroup.add(cardMesh);
        }

        webBrowserGroup.position.set(0, -4.5, -6);
        webBrowserGroup.rotation.x = -Math.PI / 6;
        scene.add(webBrowserGroup);
    }

    // 7. WARM PARTICLE DUST
    function createParticleDust() {
        const count = 1000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const cGold = new THREE.Color(0xf59e0b);
        const cCopper = new THREE.Color(0xe07a5f);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 45;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 45;

            let c = Math.random() > 0.5 ? cGold : cCopper;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
        });

        particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);
    }

    // 8. MOUSE & RESIZE HANDLERS
    function onMouseMove(event) {
        mouse.targetX = (event.clientX - windowHalfX) * 0.001;
        mouse.targetY = (event.clientY - windowHalfY) * 0.001;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 9. GSAP SCROLL CHOREOGRAPHY
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.timeline({
            scrollTrigger: {
                trigger: '.content-wrapper',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2
            }
        })
        .to(camera.position, { z: 10, y: -2 }, 0)
        .to(photoLensGroup.position, { x: 3.2, y: 0.5, z: 2 }, 0)
        .to(videoFilmGroup.position, { x: -3.2, y: 0.8, z: 1 }, 0)
        .to(webBrowserGroup.position, { y: -2, z: 0 }, 0);

        ScrollTrigger.create({
            trigger: '#retouch-lab',
            start: 'top center',
            onEnter: () => gsap.to(photoLensGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1 }),
            onLeaveBack: () => gsap.to(photoLensGroup.scale, { x: 1, y: 1, z: 1, duration: 1 })
        });

        ScrollTrigger.create({
            trigger: '#video-studio',
            start: 'top center',
            onEnter: () => gsap.to(videoFilmGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1 }),
            onLeaveBack: () => gsap.to(videoFilmGroup.scale, { x: 1, y: 1, z: 1, duration: 1 })
        });

        ScrollTrigger.create({
            trigger: '#web-design',
            start: 'top center',
            onEnter: () => gsap.to(webBrowserGroup.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 1 }),
            onLeaveBack: () => gsap.to(webBrowserGroup.scale, { x: 1, y: 1, z: 1, duration: 1 })
        });
    }

    // Dock Camera Orbits
    const scards = document.querySelectorAll('.scard');
    scards.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'orbit-photo') {
                gsap.to(camera.position, { x: 4, y: 1, z: 8, duration: 1.5, ease: 'power2.inOut' });
                document.getElementById('retouch-lab')?.scrollIntoView({ behavior: 'smooth' });
            } else if (action === 'orbit-video') {
                gsap.to(camera.position, { x: -4, y: -1, z: 8, duration: 1.5, ease: 'power2.inOut' });
                document.getElementById('video-studio')?.scrollIntoView({ behavior: 'smooth' });
            } else if (action === 'orbit-web') {
                gsap.to(camera.position, { x: 0, y: -3, z: 7, duration: 1.5, ease: 'power2.inOut' });
                document.getElementById('web-design')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 10. MAIN ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.y * 2.5 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        if (photoLensGroup) {
            photoLensGroup.rotation.y += 0.007;
            photoLensGroup.rotation.x += 0.003;
        }

        if (videoFilmGroup) {
            videoFilmGroup.rotation.y += 0.008;
            videoFilmGroup.rotation.z += 0.004;
        }

        if (webBrowserGroup) {
            webBrowserGroup.rotation.y += 0.005;
        }

        if (particleSystem) {
            particleSystem.rotation.y += 0.0004;
        }

        const time = Date.now() * 0.001;
        if (lightCopper) {
            lightCopper.position.x = Math.sin(time * 0.7) * 8;
            lightCopper.position.y = Math.cos(time * 0.5) * 6;
        }
        if (lightGold) {
            lightGold.position.x = Math.cos(time * 0.6) * 8;
            lightGold.position.z = Math.sin(time * 0.8) * 6;
        }

        renderer.render(scene, camera);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
