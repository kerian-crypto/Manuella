/* ==========================================================================
   MANUELLA STUDIO — APP INTERACTIVITY ENGINE (WARM LUXURY EDITION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 1. CUSTOM CURSOR SYSTEM
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorText = document.getElementById('cursorText');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Hover States
    const hoverElements = document.querySelectorAll('a, button, .dock-nav-item, .scard, .preset-btn, .chip-btn, .project-card, .track-header');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            if (cursorText) {
                if (el.classList.contains('ba-handle') || el.closest('#baSliderBox')) {
                    cursorText.textContent = 'GLISSER';
                    document.body.classList.add('cursor-drag');
                } else if (el.classList.contains('tb-btn') || el.classList.contains('monitor-play-btn')) {
                    cursorText.textContent = 'LECTURE';
                } else if (el.classList.contains('project-card')) {
                    cursorText.textContent = 'VOIR 3D';
                } else {
                    cursorText.textContent = 'EXPLORER';
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover', 'cursor-drag');
            if (cursorText) cursorText.textContent = '';
        });
    });


    // ==========================================
    // 2. BOTTOM DOCK MENU ACTIVE SCROLL SPY
    // ==========================================
    const dockNavItems = document.querySelectorAll('.dock-nav-item');
    const sections = document.querySelectorAll('.section, .hero-section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 200;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        dockNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-nav') === currentSectionId) {
                item.classList.add('active');
            }
        });

        // Topbar shadow on scroll
        const topbar = document.getElementById('topbar');
        if (topbar) {
            if (window.scrollY > 50) topbar.classList.add('scrolled');
            else topbar.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 3. AUDIO SYNTHESIZER (WEB AUDIO API)
    // ==========================================
    let audioCtx = null;
    let soundEnabled = false;
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled && !audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const label = soundToggle.querySelector('.sound-label');
            if (soundEnabled) {
                label.textContent = 'AUDIO ON';
                soundToggle.style.borderColor = 'var(--accent-gold)';
                if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
                playSynthBeep(880, 0.1);
            } else {
                label.textContent = 'AUDIO OFF';
                soundToggle.style.borderColor = 'var(--border-glass)';
                if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
            }
            if (window.lucide) lucide.createIcons();
        });
    }

    function playSynthBeep(freq = 440, duration = 0.08) {
        if (!soundEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { console.error(e); }
    }


    // ==========================================
    // 4. RETOUCH LAB BEFORE/AFTER SLIDER & PRESETS
    // ==========================================
    const baBox = document.getElementById('baSliderBox');
    const imgBefore = document.getElementById('imgBefore');
    const baHandle = document.getElementById('baHandle');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const imgAfter = document.getElementById('imgAfter');

    if (baBox && imgBefore && baHandle) {
        let isDraggingBA = false;

        function updateBA(x) {
            const rect = baBox.getBoundingClientRect();
            let offsetX = x - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percentage = (offsetX / rect.width) * 100;
            imgBefore.style.width = `${percentage}%`;
            baHandle.style.left = `${percentage}%`;
        }

        baBox.addEventListener('mousedown', (e) => {
            isDraggingBA = true;
            updateBA(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingBA) return;
            updateBA(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDraggingBA = false;
        });

        // Touch Support
        baBox.addEventListener('touchstart', (e) => {
            isDraggingBA = true;
            updateBA(e.touches[0].clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDraggingBA) return;
            updateBA(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isDraggingBA = false;
        });
    }

    // Color Grading Preset Selector
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const preset = btn.dataset.preset;
            if (imgAfter && imgBefore) {
                imgAfter.className = `ba-image image-after filter-${preset}`;
                imgBefore.className = `ba-image image-before filter-${preset}`;
            }
            playSynthBeep(600, 0.05);
        });
    });


    // ==========================================
    // 5. VIDEO EDITING STUDIO INTERACTIVE TIMELINE
    // ==========================================
    const monitorPlayBtn = document.getElementById('monitorPlayBtn');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const mainPlayIcon = document.getElementById('mainPlayIcon');
    const playIcon = document.getElementById('playIcon');
    const playhead = document.getElementById('playhead');
    const timelineRuler = document.getElementById('timelineRuler');
    const tcReadout = document.getElementById('tcReadout');
    const timecodeDisplay = document.getElementById('timecodeDisplay');
    const waveBars = document.getElementById('waveBars');

    let isPlayingVideo = false;
    let videoProgress = 0;
    let playInterval = null;

    const videoFrames = [
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop'
    ];
    const videoFrameImg = document.getElementById('videoFrame');

    function toggleVideoPlayback() {
        isPlayingVideo = !isPlayingVideo;
        if (isPlayingVideo) {
            startVideoPlayback();
        } else {
            pauseVideoPlayback();
        }
        playSynthBeep(520, 0.08);
    }

    function startVideoPlayback() {
        isPlayingVideo = true;
        if (waveBars) waveBars.classList.add('animating');

        if (mainPlayIcon) mainPlayIcon.setAttribute('data-lucide', 'pause');
        if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
        if (window.lucide) lucide.createIcons();

        playInterval = setInterval(() => {
            videoProgress += 0.8;
            if (videoProgress > 100) videoProgress = 0;

            updatePlayheadUI(videoProgress);
        }, 50);
    }

    function pauseVideoPlayback() {
        isPlayingVideo = false;
        clearInterval(playInterval);
        if (waveBars) waveBars.classList.remove('animating');

        if (mainPlayIcon) mainPlayIcon.setAttribute('data-lucide', 'play');
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        if (window.lucide) lucide.createIcons();
    }

    function updatePlayheadUI(percentage) {
        if (!timelineRuler || !playhead) return;
        const rulerWidth = timelineRuler.clientWidth;
        const startOffset = 200;
        const usableWidth = rulerWidth - startOffset;

        const leftPx = startOffset + (usableWidth * (percentage / 100));
        playhead.style.left = `${leftPx}px`;

        const currentSeconds = Math.floor((percentage / 100) * 15);
        const secStr = currentSeconds < 10 ? `0${currentSeconds}` : `${currentSeconds}`;
        if (tcReadout) tcReadout.textContent = `00:${secStr} / 00:15`;
        if (timecodeDisplay) timecodeDisplay.textContent = `00:04:${secStr}:18`;

        if (videoFrameImg) {
            if (percentage < 33) videoFrameImg.src = videoFrames[0];
            else if (percentage < 66) videoFrameImg.src = videoFrames[1];
            else videoFrameImg.src = videoFrames[2];
        }
    }

    if (monitorPlayBtn) monitorPlayBtn.addEventListener('click', toggleVideoPlayback);
    if (btnPlayPause) btnPlayPause.addEventListener('click', toggleVideoPlayback);

    // Track Toggles
    const trackToggles = document.querySelectorAll('.track-toggle');
    trackToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const clip = toggle.closest('.track-row').querySelector('.clip');
            if (clip) {
                clip.style.opacity = toggle.classList.contains('active') ? '1' : '0.2';
            }
            playSynthBeep(700, 0.05);
        });
    });


    // ==========================================
    // 6. WEB DESIGN 3D ISOMETRIC SHOWCASE
    // ==========================================
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const projectsGrid = document.getElementById('projectsGrid');

    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.dataset.mode;
            if (projectsGrid) {
                projectsGrid.className = `projects-grid mode-${mode}`;
            }
            playSynthBeep(650, 0.06);
        });
    });

    // 3D Card Tilt on Hover
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (projectsGrid && projectsGrid.classList.contains('mode-wireframe')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ==========================================
    // 7. ESTIMATEUR DE PROJET INTERACTIF & WHATSAPP
    // ==========================================
    const chipBtns = document.querySelectorAll('.chip-btn');
    const radioCards = document.querySelectorAll('.radio-card');
    const timeSlider = document.getElementById('timeSlider');
    const daysDisplay = document.getElementById('daysDisplay');
    const expressBadge = document.getElementById('expressBadge');

    const summaryServices = document.getElementById('summaryServices');
    const summaryTime = document.getElementById('summaryTime');
    const summaryPrice = document.getElementById('summaryPrice');
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');

    let selectedServices = [
        { name: 'Web Design 3D', cost: 250000 }
    ];
    let scopeMultiplier = 1;
    let selectedDays = 14;

    function updateEstimator() {
        let baseCost = selectedServices.reduce((acc, curr) => acc + curr.cost, 0);
        if (baseCost === 0) baseCost = 100000;

        let totalCost = Math.round(baseCost * scopeMultiplier);

        if (selectedDays <= 7) {
            totalCost = Math.round(totalCost * 1.25);
            if (expressBadge) expressBadge.classList.remove('hidden');
        } else {
            if (expressBadge) expressBadge.classList.add('hidden');
        }

        const formattedPrice = totalCost.toLocaleString('fr-FR') + ' FCFA';
        
        if (summaryServices) {
            const names = selectedServices.map(s => s.name).join(', ');
            summaryServices.textContent = names || 'Aucun service sélectionné';
        }
        if (daysDisplay) daysDisplay.textContent = `${selectedDays} jours`;
        if (summaryTime) summaryTime.textContent = `${selectedDays} jours ouvrés`;
        if (summaryPrice) summaryPrice.textContent = formattedPrice;

        if (sendWhatsappBtn) {
            const serviceStr = selectedServices.map(s => s.name).join(' + ');
            const message = `Bonjour Manuella! Je viens de composer mon projet sur votre portfolio Studio:%0A%0A- Services: ${encodeURIComponent(serviceStr)}%0A- Complexité: x${scopeMultiplier}%0A- Délai souhaité: ${selectedDays} jours%0A- Estimation: ${encodeURIComponent(formattedPrice)}%0A%0APouvons-nous en discuter ?`;
            sendWhatsappBtn.href = `https://wa.me/237651696402?text=${message}`;
        }
    }

    chipBtns.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            const cost = parseInt(chip.dataset.cost, 10);
            const name = chip.textContent.trim();

            if (chip.classList.contains('active')) {
                if (!selectedServices.some(s => s.name === name)) {
                    selectedServices.push({ name, cost });
                }
            } else {
                selectedServices = selectedServices.filter(s => s.name !== name);
            }

            updateEstimator();
            playSynthBeep(550, 0.05);
        });
    });

    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const input = card.querySelector('input');
            if (input) {
                input.checked = true;
                scopeMultiplier = parseFloat(input.value);
            }
            updateEstimator();
            playSynthBeep(600, 0.05);
        });
    });

    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            selectedDays = parseInt(e.target.value, 10);
            updateEstimator();
        });
    }

    updateEstimator();


    // ==========================================
    // 8. COPY PHONE NUMBER TO CLIPBOARD
    // ==========================================
    const copyPhoneItem = document.getElementById('copyPhoneItem');
    const phoneText = document.getElementById('phoneText');

    if (copyPhoneItem) {
        copyPhoneItem.addEventListener('click', () => {
            const phone = '+237651696402';
            navigator.clipboard.writeText(phone).then(() => {
                if (phoneText) {
                    const original = phoneText.textContent;
                    phoneText.textContent = '✔ N° COPIÉ DANS LE PRESSE-PAPIER !';
                    phoneText.style.color = 'var(--accent-emerald)';
                    setTimeout(() => {
                        phoneText.textContent = original;
                        phoneText.style.color = '';
                    }, 2500);
                }
                playSynthBeep(900, 0.1);
            });
        });
    }

});
