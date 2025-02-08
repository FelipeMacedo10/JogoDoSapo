const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const frogImage = new Image();
frogImage.src = 'frog.png';
const truckImage = new Image();
truckImage.src = 'truck.png';
const fastCarImage = new Image();
fastCarImage.src = 'fastcar.png';
const carImage = new Image();
carImage.src = 'car.png';
const bulldozerImage = new Image();
bulldozerImage.src = 'bulldozer.png';

const frog = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    image: frogImage,
    speed: 4,
    dx: 0,
    dy: 0
};

let score = 0;
let lives = 3;

const carTypes = [
    { image: truckImage, speed: 2, width: 100, height: 30, direction: 1 },
    { image: fastCarImage, speed: 5, width: 60, height: 30, direction: -1 },
    { image: carImage, speed: 3, width: 70, height: 30, direction: 1 },
    { image: bulldozerImage, speed: 1, width: 120, height: 80, direction: -1 }
];

let difficulty = 'medium';
const initialPositions = [];
const obstacles = [];
const obstacleYPositions = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550];

// Função para configurar a dificuldade
function setDifficulty() {
    const difficultySelect = document.getElementById('difficultySelect');
    difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        carTypes.forEach(type => type.speed *= 0.8);
    } else if (difficulty === 'medium') {
        carTypes.forEach(type => type.speed = type.speed);
    } else if (difficulty === 'hard') {
        carTypes.forEach(type => type.speed *= 1.5);
    }
}

// Função para gerar obstáculos iniciais
function generateObstacles() {
    const positions = [
        { type: 0, x: 100, y: 100 },
        { type: 0, x: 400, y: 100 },
        { type: 1, x: 100, y: 150 },
        { type: 1, x: 400, y: 150 },
        { type: 2, x: 100, y: 200 },
        { type: 2, x: 400, y: 200 },
        { type: 3, x: 200, y: 250 }
    ];
    positions.forEach((pos, idx) => {
        obstacles.push(createObstacle(pos.x, pos.y, carTypes[pos.type]));
        initialPositions.push({ x: pos.x, y: pos.y });
    });
    obstacles.push(createObstacle(450, 350, carTypes[2]));
    obstacles.push(createObstacle(100, 400, carTypes[1]));
    initialPositions.push({ x: 450, y: 350 });
    initialPositions.push({ x: 100, y: 400 });
}

// Função para criar um obstáculo
function createObstacle(x, y, type) {
    return { x: x, y: y, width: type.width, height: type.height, speed: type.speed, image: type.image, direction: type.direction };
}

// Função para desenhar o sapo
function drawFrog() {
    ctx.drawImage(frog.image, frog.x, frog.y, frog.width, frog.height);
}

// Função para desenhar os obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        const aspectRatio = obstacle.image.width / obstacle.image.height;
        const scaledWidth = obstacle.width;
        const scaledHeight = scaledWidth / aspectRatio;
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, scaledWidth, scaledHeight);
    });
}

// Função para desenhar o painel de pontuação e vidas
function drawPanel() {
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = '#72c026';
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    ctx.fillStyle = 'black';
    ctx.font = '20px Trebuchet MS';
    ctx.textAlign = 'left';  // Garante que o texto fique alinhado à esquerda
    ctx.fillText(`Pontuação: ${score}`, 20, 30);
    ctx.textAlign = 'right'; // Garante que o texto fique alinhado à direita
    ctx.fillText(`Vidas: ${lives}`, canvas.width - 60, 30);
}

// Função para mover os obstáculos
function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.speed * obstacle.direction;
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
        } else if (obstacle.x > canvas.width) {
            obstacle.x = -obstacle.width;
        }
    });
}

// Função para mover o sapo
function moveFrog() {
    frog.x += frog.dx;
    frog.y += frog.dy;
    if (frog.x < 0) frog.x = 0;
    if (frog.x + frog.width > canvas.width) frog.x = canvas.width - frog.width;
    if (frog.y < 50) frog.y = 50;
    if (frog.y + frog.height > canvas.height - 50) frog.y = canvas.height - 50 - frog.height;
}

// Função para controlar o movimento do sapo
function control(e) {
    if (e.key === 'ArrowUp') { frog.dy = -frog.speed; }
    else if (e.key === 'ArrowDown') { frog.dy = frog.speed; }
    else if (e.key === 'ArrowLeft') { frog.dx = -frog.speed; }
    else if (e.key === 'ArrowRight') { frog.dx = frog.speed; }
}

// Função para parar o movimento
function stopMovement(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { frog.dy = 0; }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { frog.dx = 0; }
}

// Função para verificar colisões com obstáculos
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (frog.x < obstacle.x + obstacle.width && frog.x + frog.width > obstacle.x &&
            frog.y < obstacle.y + obstacle.height && frog.y + frog.height > obstacle.y) {
            score -= 200;
            if (score < 0) score = 0;
            lives -= 1;
            voltar();
            if (lives <= 0) {
                // Se as vidas acabaram, parar o jogo
                fimDeJogo();
            }
        }
    });
}

// Função para aumentar a pontuação
function increaseScore() {
    if (frog.y <= 50) {
        score += 100;
        voltar();
        if (score >= 1000) {
            lives += 1;
            score -= 1000;
        }
    }
}

// Função para parar o jogo e exibir "Game Over"
function fimDeJogo() {
    cancelAnimationFrame(gameLoopId); // Para o loop de animação
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Exibe a mensagem de "Game Over"
    ctx.fillStyle = 'black';
    ctx.font = '50px Trebuchet MS';
    ctx.textAlign = 'center';
    ctx.fillText('Fim de Jogo', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Trebuchet MS';
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Pressione "Reiniciar jogo" para jogar novamente`, canvas.width / 2, canvas.height / 2 + 50);

    //Altera do botão de iniciar para o botão de reiniciar
    alterarBotoes()

}

//Altera do botão de iniciar para o botão de reiniciar
function alterarBotoes() {
    var botaoIniciar = document.getElementById('startButton');
        botaoIniciar.style.display = 'none';
    var botaoReiniciar = document.getElementById('restartButton');
        botaoReiniciar.style.display = 'block';

};

// Função para voltar o jogo ao começo quando o sapo atravessa a rua
function voltar(volte = false) {
    frog.x = canvas.width / 2 - 20;
    frog.y = canvas.height - 60;
    frog.dx = 0;
    frog.dy = 0;

    obstacles.forEach((obstacle, idx) => {
        obstacle.x = initialPositions[idx].x;
        obstacle.y = initialPositions[idx].y;
    });

    if (volte) {
        score = 0;
        lives = 3;
    }
}

let gameLoopId;

// Função que gerencia o loop de animação
function gameLoop() {
    if(lives>0){
        setDifficulty();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        drawPanel();
        drawFrog();
        moveFrog();
        drawObstacles();
        moveObstacles();
        checkCollisions();
        increaseScore();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Função para iniciar o jogo
function startGame() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('difficultySelect').disabled = true;
    generateObstacles();
    gameLoop();
}

function restartGame() {
    // Redefine as variáveis do jogo
    score = 0;
    lives = 3;

    // Limpa o canvas e redefine o estado inicial
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redefine a posição inicial do sapo
    frog.x = canvas.width / 2 - 20;
    frog.y = canvas.height - 60;
    frog.dx = 0;
    frog.dy = 0;

    drawPanel();
    drawFrog();
    moveFrog();
    drawObstacles();
    moveObstacles();
    checkCollisions();
    increaseScore();
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Função para reiniciar o jogo ao clicar no botão de reiniciar
document.getElementById('restartButton').addEventListener('click', () => {
    restartGame();
});

document.getElementById('startButton').addEventListener('click', () => {
    startGame();
});

document.addEventListener('keydown', control);
document.addEventListener('keyup', stopMovement);