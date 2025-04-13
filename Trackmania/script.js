const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CAR_WIDTH = 20;
const CAR_HEIGHT = 30;

let currentCircuit = 0;
let playerCar;
let circuits = [];
let gameRunning = false;
let lap = 1;
let startTime;
let raceTime = 0;
let animationFrameId;
let circuitOffset = {
    x: 0,
    y: 0
}; // Décalage du circuit
let camera = {
    x: canvas.width / 2,
    y: canvas.height / 2
}; // Position de la caméra (fixe)

// Fonction pour initialiser le jeu avec un circuit spécifique
function initGame(circuitIndex) {
    currentCircuit = circuitIndex;
    playerCar = {
        x: camera.x,
        y: camera.y,
        angle: 0,
        speed: 0
    }; // Voiture au centre
    circuits = [
        // Circuits définis par rapport au début
        [{
            x: 0,
            y: 0
        }, {
            x: 100,
            y: 0
        }, {
            x: 100,
            y: 100
        }, {
            x: 0,
            y: 100
        }],
        [{
            x: 0,
            y: 0
        }, {
            x: 300,
            y: 0
        }, {
            x: 300,
            y: 200
        }, {
            x: 0,
            y: 200
        }],
        [{
            x: 0,
            y: 0
        }, {
            x: 150,
            y: 100
        }, {
            x: 0,
            y: 200
        }, {
            x: -150,
            y: 100
        }]
    ];
    circuitOffset = {
        x: 0,
        y: 0
    }; // Décalage à zéro
    gameRunning = true;
    lap = 1;
    startTime = Date.now();
    raceTime = 0;
    document.getElementById('current-lap').textContent = lap;
    document.getElementById('current-time').textContent = formatTime(raceTime);
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('ingame-controls').style.display = 'flex';
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

// Fonction pour démarrer la course (appelée par les boutons de sélection de circuit)
function startRace(circuitIndex) {
    initGame(circuitIndex);
}

// Fonction pour réinitialiser la course
function restartRace() {
    initGame(currentCircuit); // Recommencer sur le même circuit
}

// Fonction pour revenir au menu
function returnToMenu() {
    gameRunning = false;
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('ingame-controls').style.display = 'none';
}

// Fonction principale de la boucle de jeu
function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Fonction pour mettre à jour l'état du jeu (mouvement, collisions, etc.)
function update() {
    if (!gameRunning) return;

    // Mettre à jour la voiture (exemple : mouvement simple)
    let moveX = Math.cos(playerCar.angle) * playerCar.speed;
    let moveY = Math.sin(playerCar.angle) * playerCar.speed;

    // Déplacer le circuit dans la direction opposée
    circuitOffset.x -= moveX;
    circuitOffset.y -= moveY;

    // Gérer les collisions avec le circuit
    checkCollisions();

    // Mettre à jour le temps de course
    raceTime = Date.now() - startTime;
    document.getElementById('current-time').textContent = formatTime(raceTime);

    // Vérifier si le tour est terminé
    checkLapCompletion();
}

// Fonction pour dessiner le jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le circuit
    drawCircuit();

    // Dessiner la voiture du joueur
    drawCar();
}

// Fonction pour dessiner le circuit
function drawCircuit() {
    ctx.beginPath();
    circuits[currentCircuit].forEach((point, index) => {
        let drawX = point.x + circuitOffset.x;
        let drawY = point.y + circuitOffset.y;
        if (index === 0) {
            ctx.moveTo(drawX, drawY);
        } else {
            ctx.lineTo(drawX, drawY);
        }
    });
    ctx.closePath();
    ctx.strokeStyle = '#0ff';
    ctx.stroke();
}

// Fonction pour dessiner la voiture
function drawCar() {
    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.rect(playerCar.x - CAR_WIDTH / 2, playerCar.y - CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
    ctx.rect(playerCar.x - CAR_WIDTH / 4, playerCar.y - CAR_HEIGHT, CAR_WIDTH / 2, CAR_HEIGHT / 4); // "Cabine"
    ctx.fill();
    ctx.closePath();
}

// Fonction pour vérifier les collisions
function checkCollisions() {
    // Logique de collision (à implémenter)
}

// Fonction pour vérifier si un tour est terminé
function checkLapCompletion() {
    // Logique de vérification de tour (à implémenter)
    // Incrémenter 'lap' si le tour est terminé
    if (lap > 3) {
        gameOver();
    } else {
        document.getElementById('current-lap').textContent = lap;
    }
}

// Fonction pour formater le temps (millisecondes en minutes:secondes)
function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Fonction pour afficher l'écran de fin de partie
function gameOver() {
    gameRunning = false;
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('ingame-controls').style.display = 'none';
    document.getElementById('final-time').textContent = formatTime(raceTime);
}

// Fonction pour gérer les touches (exemple : accélération, direction)
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    if (event.key === 'ArrowUp') {
        playerCar.speed = 5;
    } else if (event.key === 'ArrowDown') {
        playerCar.speed = -3;
    } else if (event.key === 'ArrowLeft') {
        playerCar.angle -= 0.1;
    } else if (event.key === 'ArrowRight') {
        playerCar.angle += 0.1;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        playerCar.speed = 0;
    }
});

// Initialisation au chargement de la page (optionnel)
returnToMenu();