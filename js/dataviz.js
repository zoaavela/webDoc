// Animated counter for stat cards
function animateCounter(element) {
    // Gère les nombres décimaux et les unités comme 'M'
    const targetValue = element.getAttribute('data-target');
    // Récupère l'unité, ou prend une chaîne vide si non définie
    const unit = element.getAttribute('data-unit') || ''; 
    if (!targetValue) return;

    let target = parseFloat(targetValue);
    
    // Si l'unité est M (Millions), la valeur cible réelle est déjà un nombre (ex: 106)
    // On utilise cette valeur pour l'animation.

    const duration = 2000;
    // Nombre d'itérations basé sur 60 FPS (~16ms par frame)
    const totalSteps = duration / 16; 
    const step = target / totalSteps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            // Arrondir la valeur finale à un nombre de décimales raisonnable pour la clarté.
            // Le .toFixed(2) est conservé pour les cas 'M', même s'il est ensuite nettoyé par .replace
            let finalValue;
            if (unit === 'M') {
                 // Pour 'M', on affiche la cible avec 1 décimale, car les données réelles sont en millions
                 // et on garde la valeur entière si la décimale est .0
                finalValue = target.toFixed(1).replace(/\.0$/, ''); 
            } else if (unit === '') {
                // Pour les valeurs entières (Pays, Courts), on affiche le nombre entier
                finalValue = Math.floor(target);
            } else {
                 // Pour toute autre unité, on affiche la cible telle quelle ou arrondie
                 finalValue = target.toFixed(0); 
            }

            element.textContent = finalValue + unit;
            clearInterval(timer);
        } else {
            let displayValue = current;
            
            if (unit === 'M') {
                // Afficher en décimal pour les millions pendant l'animation
                element.textContent = displayValue.toFixed(1) + unit;
            } else {
                // Afficher en entier pour les autres (pays, etc.)
                element.textContent = Math.floor(displayValue);
            }
        }
    }, 16);
}

// Animate bars (Pas de correction nécessaire ici, la fonction semble correcte)
function animateBars() {
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width');
        }, index * 150);
    });
}

// Add interactive balls to tennis court (Pas de correction nécessaire ici, la fonction semble correcte)
function addCourtBalls() {
    // **CORRECTION:** L'ID 'interactiveCourt' est maintenant dans le HTML.
    const court = document.getElementById('interactiveCourt');
    if (!court) return; // Sécurité

    // Positions basées sur le pourcentage de la hauteur (top) et largeur (left) du court
    const positions = [
        { left: '25%', top: '20%' }, // Zone 1
        { left: '75%', top: '35%' }, // Zone 2
        { left: '50%', top: '60%' }, // Zone 3 (Près du T)
        { left: '30%', top: '80%' }, // Zone 4
        { left: '70%', top: '75%' }  // Zone 5
    ];

    positions.forEach((pos, index) => {
        setTimeout(() => {
            const ball = document.createElement('div');
            ball.className = 'court-data-point';
            ball.style.left = pos.left;
            ball.style.top = pos.top;
            court.appendChild(ball);
        }, index * 300);
    });
}

// Enhanced marker interactions (Pas de correction nécessaire ici, le code est déjà correct et fonctionnel)
document.querySelectorAll('.country-marker').forEach(marker => {
    // Le code existant est correct et fonctionne bien pour l'interactivité.
    marker.addEventListener('mouseenter', function() {
        const country = this.getAttribute('data-country');
        const value = this.getAttribute('data-value');
        this.textContent = `${country}: ${value}`;
    });
    
    marker.addEventListener('mouseleave', function() {
        const value = this.getAttribute('data-value');
        // Extraction de l'emoji initial
        const emoji = this.textContent.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]/g);
        this.textContent = `${emoji ? emoji[0] : ''} ${value}`;
    });
});

// Intersection Observer for scroll animations (Pas de correction nécessaire ici)
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Retirer la classe 'loading' pour déclencher l'animation CSS si elle existe
            entry.target.classList.remove('loading');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Optionnel : arrêter l'observation après la première apparition
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.loading').forEach(el => {
    el.style.transform = 'translateY(20px)'; // Préparer la transition
    observer.observe(el);
});

// Initialize animations when page loads
window.addEventListener('load', () => {
    // Animate counters: Cible les éléments qui ont l'attribut 'data-target'
    document.querySelectorAll('.data-value[data-target]').forEach(animateCounter);
    
    // Animate bars after a delay
    setTimeout(animateBars, 500);
    
    // Add tennis balls to court: Fonctionne maintenant car l'ID est présent
    setTimeout(addCourtBalls, 1000);
});