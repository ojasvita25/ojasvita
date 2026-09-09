/**
 * Ojasvita — Tiered Interactive Role Graph
 * Tier 1: Central nexus (Ojasvita) -> 3 Roles (MLE, Creative Tech, Dancer)
 * Tier 2: Dedicated Sub-graphs for:
 *   - Machine Learning Engineer (Startups & Applied Engineering)
 *   - Creative Technologist (Installations & Interactive Systems)
 *   - Classical Dancer (Kathak Arts & Embodied Computing)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // Tier 1: Main Triangular Role Graph
    // ----------------------------------------------------------------------
    const scene = document.getElementById('graphScene');
    const svg = document.getElementById('connectionsSvg');
    const linesGroup = document.getElementById('linesGroup');
    const centerNode = document.getElementById('centralNode');

    const roleNodes = [
        { el: document.getElementById('nodeMle'), id: 'mle', pos: 'top' },
        { el: document.getElementById('nodeTech'), id: 'tech', pos: 'bottom-left' },
        { el: document.getElementById('nodeDancer'), id: 'dancer', pos: 'bottom-right' }
    ];

    function drawMainGraph() {
        if (!scene || !svg || !linesGroup || !centerNode) return;

        const sceneRect = scene.getBoundingClientRect();
        const centerRect = centerNode.getBoundingClientRect();

        const cX = (centerRect.left + centerRect.width / 2) - sceneRect.left;
        const cY = (centerRect.top + centerRect.height / 2) - sceneRect.top;

        linesGroup.innerHTML = '';

        roleNodes.forEach((role) => {
            if (!role.el) return;
            const targetRect = role.el.getBoundingClientRect();

            const tCenterX = (targetRect.left + targetRect.width / 2) - sceneRect.left;
            const tCenterY = (targetRect.top + targetRect.height / 2) - sceneRect.top;

            const dx = tCenterX - cX;
            const dy = tCenterY - cY;
            const angle = Math.atan2(dy, dx);

            // Elliptical boundary intersection for central pill
            const a = (centerRect.width / 2) + 2;
            const b = (centerRect.height / 2) + 2;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const centerDist = (a * b) / Math.sqrt((b * cosA) ** 2 + (a * sinA) ** 2);
            const startX = cX + cosA * centerDist;
            const startY = cY + sinA * centerDist;

            // Rectangular boundary intersection for target card
            const halfW = (targetRect.width / 2) + 6;
            const halfH = (targetRect.height / 2) + 6;
            const absCos = Math.abs(cosA);
            const absSin = Math.abs(sinA);
            let targetDist;
            if (halfW * absSin <= halfH * absCos) {
                targetDist = halfW / absCos;
            } else {
                targetDist = halfH / absSin;
            }
            const endX = tCenterX - cosA * targetDist;
            const endY = tCenterY - sinA * targetDist;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('id', `edge-${role.id}`);
            line.setAttribute('marker-end', 'url(#arrow)');

            linesGroup.appendChild(line);

            role.el.addEventListener('mouseenter', () => line.classList.add('active'));
            role.el.addEventListener('mouseleave', () => line.classList.remove('active'));
        });
    }

    // ----------------------------------------------------------------------
    // Tier 2: Sub-Graph Line Connectors Helper
    // ----------------------------------------------------------------------
    function drawSubGraph(sceneId, linesGroupId, rootNodeId, cardSelector, arrowId) {
        const subScene = document.getElementById(sceneId);
        const subLinesGroup = document.getElementById(linesGroupId);
        const rootNode = document.getElementById(rootNodeId);

        if (!subScene || !subLinesGroup || !rootNode || window.innerWidth <= 768) {
            if (subLinesGroup) subLinesGroup.innerHTML = '';
            return;
        }

        const sceneRect = subScene.getBoundingClientRect();
        const rootRect = rootNode.getBoundingClientRect();

        const rX = (rootRect.left + rootRect.width / 2) - sceneRect.left;
        const rY = (rootRect.bottom) - sceneRect.top;

        subLinesGroup.innerHTML = '';
        const cards = subScene.querySelectorAll(cardSelector);

        cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const nX = (cardRect.left + cardRect.width / 2) - sceneRect.left;
            const nY = (cardRect.top) - sceneRect.top - 6;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', rX);
            line.setAttribute('y1', rY + 4);
            line.setAttribute('x2', nX);
            line.setAttribute('y2', nY);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('marker-end', `url(#${arrowId})`);

            subLinesGroup.appendChild(line);

            card.addEventListener('mouseenter', () => line.classList.add('active'));
            card.addEventListener('mouseleave', () => line.classList.remove('active'));
        });
    }

    function drawAllSubGraphs() {
        drawSubGraph('mleScene', 'mleLinesGroup', 'mleRootNode', '.startup-node', 'subArrow');
        drawSubGraph('techScene', 'techLinesGroup', 'techRootNode', '.startup-node', 'techArrow');
        drawSubGraph('dancerScene', 'dancerLinesGroup', 'dancerRootNode', '.startup-node', 'dancerArrow');
    }

    // ----------------------------------------------------------------------
    // Navigation Triggers for the 3 Roles (Slide-Up Panels)
    // ----------------------------------------------------------------------
    const allSubgraphs = document.querySelectorAll('.subgraph-view');
    const nodeMle = document.getElementById('nodeMle');
    const mleSection = document.getElementById('mleSection');

    const nodeTech = document.getElementById('nodeTech');
    const techSection = document.getElementById('techSection');

    const nodeDancer = document.getElementById('nodeDancer');
    const dancerSection = document.getElementById('dancerSection');

    function openSubGraph(section) {
        if (!section) return;
        allSubgraphs.forEach(s => s.classList.remove('active'));
        section.classList.add('active');
        section.scrollTop = 0;
        setTimeout(() => {
            drawAllSubGraphs();
        }, 200);
    }

    function closeAllSubGraphs() {
        allSubgraphs.forEach(s => s.classList.remove('active'));
    }

    if (nodeMle && mleSection) {
        nodeMle.addEventListener('click', () => openSubGraph(mleSection));
    }

    if (nodeTech && techSection) {
        nodeTech.addEventListener('click', () => openSubGraph(techSection));
    }

    if (nodeDancer && dancerSection) {
        nodeDancer.addEventListener('click', () => openSubGraph(dancerSection));
    }

    // All "Return to Ojasvita Nexus" Buttons
    const backButtons = document.querySelectorAll('.back-link, #backToHub, .back-to-hub-btn');
    backButtons.forEach((btn) => {
        btn.addEventListener('click', closeAllSubGraphs);
    });

    // ----------------------------------------------------------------------
    // Central Node: Intro Modal Interactions
    // ----------------------------------------------------------------------
    const introModalBackdrop = document.getElementById('introModalBackdrop');
    const introCloseBtn = document.getElementById('introCloseBtn');

    function openIntroModal() {
        if (!introModalBackdrop) return;
        introModalBackdrop.classList.add('active');
        introModalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeIntroModal() {
        if (!introModalBackdrop) return;
        introModalBackdrop.classList.remove('active');
        introModalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        drawMainGraph();
        setTimeout(drawMainGraph, 60);
        setTimeout(drawMainGraph, 250);
    }

    function revealGraph() {
        if (!scene.classList.contains('revealed')) {
            scene.classList.add('revealed');
            // Animate line drawings in sync with node transitions
            const intervals = [50, 150, 300, 500, 700];
            intervals.forEach((t) => setTimeout(drawMainGraph, t));
        }
    }

    function handleCenterClick() {
        revealGraph();
        openIntroModal();
    }

    if (centerNode) {
        centerNode.addEventListener('click', handleCenterClick);
        centerNode.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCenterClick();
            }
        });
    }

    const introExploreBtn = document.getElementById('introExploreBtn');
    if (introCloseBtn) {
        introCloseBtn.addEventListener('click', closeIntroModal);
    }

    if (introExploreBtn) {
        introExploreBtn.addEventListener('click', closeIntroModal);
    }

    if (introModalBackdrop) {
        introModalBackdrop.addEventListener('click', (e) => {
            if (e.target === introModalBackdrop) {
                closeIntroModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (introModalBackdrop && introModalBackdrop.classList.contains('active')) {
                closeIntroModal();
            } else {
                closeAllSubGraphs();
            }
        }
    });

    // Initial renders
    drawMainGraph();
    drawAllSubGraphs();
    setTimeout(drawMainGraph, 50);
    setTimeout(drawMainGraph, 200);

    // Re-draw when all fonts & images finish loading
    window.addEventListener('load', () => {
        drawMainGraph();
        drawAllSubGraphs();
    });

    if (document.fonts) {
        document.fonts.ready.then(() => {
            drawMainGraph();
            drawAllSubGraphs();
        });
    }

    // Resize handling
    window.addEventListener('resize', debounce(() => {
        drawMainGraph();
        drawAllSubGraphs();
    }, 100));

    window.addEventListener('orientationchange', () => {
        setTimeout(drawMainGraph, 100);
        setTimeout(drawMainGraph, 300);
    });

    // Utility: Debounce
    function debounce(fn, wait) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), wait);
        };
    }
});