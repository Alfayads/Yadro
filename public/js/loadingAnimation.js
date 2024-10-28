
// CSS Styles
const styles = `
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 24, 39, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
}

/* Base loader container */
.loader-container {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Style 1: DNA Helix */
.loader-dna {
  width: 100px;
  height: 100px;
  position: relative;
  perspective: 1000px;
}

.dna-strand {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: dnaRotate 2s linear infinite;
}

.dna-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Style 2: Liquid Fill */
.loader-liquid {
  width: 100px;
  height: 100px;
  border: 4px solid #fff;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.liquid {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #4F46E5, #06B6D4);
  animation: fillLiquid 2.5s ease-in-out infinite;
}

.liquid::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
}

/* Style 3: Geometric Morph */
.loader-geometric {
  width: 80px;
  height: 80px;
  position: relative;
}

.geo-shape {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid;
  animation: morphShape 4s ease-in-out infinite;
}

/* Style 4: Particle System */
.loader-particles {
  width: 120px;
  height: 120px;
  position: relative;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: particleFloat 2s ease-in-out infinite;
}

/* Style 5: Glitch Effect */
.loader-glitch {
  font-size: 24px;
  font-family: monospace;
  color: white;
  position: relative;
}

.glitch-text {
  position: relative;
  animation: glitch 1s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Animations */
@keyframes dnaRotate {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes fillLiquid {
  0%, 100% { transform: translateY(100%) rotate(0deg); }
  50% { transform: translateY(0%) rotate(180deg); }
}

@keyframes morphShape {
  0% { clip-path: circle(50%); }
  25% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
  50% { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
  75% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
  100% { clip-path: circle(50%); }
}

@keyframes particleFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(var(--tx), var(--ty)); }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

/* Loading text styles */
.loading-text {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: system-ui, -apple-system, sans-serif;
  color: white;
  font-size: 16px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 2px;
}
`;

class LoaderManager {
    constructor() {
        this.addStyles();
    }

    addStyles() {
        if (!document.getElementById('loader-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'loader-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    createDNALoader() {
        const loader = document.createElement('div');
        loader.className = 'loader-dna';

        const strand = document.createElement('div');
        strand.className = 'dna-strand';

        // Create DNA particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'dna-particle';
            particle.style.top = `${i * 5}%`;
            particle.style.left = `${Math.sin(i * 0.5) * 50 + 50}%`;
            particle.style.backgroundColor = i % 2 ? '#4F46E5' : '#06B6D4';
            strand.appendChild(particle);
        }

        loader.appendChild(strand);
        return loader;
    }

    createLiquidLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader-liquid';

        const liquid = document.createElement('div');
        liquid.className = 'liquid';

        loader.appendChild(liquid);
        return loader;
    }

    createGeometricLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader-geometric';

        const shape = document.createElement('div');
        shape.className = 'geo-shape';
        shape.style.borderColor = '#4F46E5';

        loader.appendChild(shape);
        return loader;
    }

    createParticleLoader() {
        const loader = document.createElement('div');
        loader.className = 'loader-particles';

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 50}px`);
            particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 50}px`);
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            loader.appendChild(particle);
        }

        return loader;
    }

    createGlitchLoader(text) {
        const loader = document.createElement('div');
        loader.className = 'loader-glitch';

        const glitchText = document.createElement('div');
        glitchText.className = 'glitch-text';
        glitchText.setAttribute('data-text', text);
        glitchText.textContent = text;

        loader.appendChild(glitchText);
        return loader;
    }
}

function showLoadingAnimation(type = 'dna', message = 'Loading...') {
    const loaderManager = new LoaderManager();

    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';

    const container = document.createElement('div');
    container.className = 'loader-container';

    let loader;
    switch (type.toLowerCase()) {
        case 'dna':
            loader = loaderManager.createDNALoader();
            break;
        case 'liquid':
            loader = loaderManager.createLiquidLoader();
            break;
        case 'geometric':
            loader = loaderManager.createGeometricLoader();
            break;
        case 'particles':
            loader = loaderManager.createParticleLoader();
            break;
        case 'glitch':
            loader = loaderManager.createGlitchLoader(message);
            break;
        default:
            loader = loaderManager.createDNALoader();
    }

    const text = document.createElement('div');
    text.className = 'loading-text';
    text.textContent = message;

    container.appendChild(loader);
    if (type !== 'glitch') {
        container.appendChild(text);
    }
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    return () => hideLoadingAnimation();
}

function hideLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}
