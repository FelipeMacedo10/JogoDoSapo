const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustando o tamanho do canvas
canvas.width = 1200;  // Largura aumentada
canvas.height = 600;  // Altura aumentada

// Propriedades do sapo
const frog = {
    x: canvas.width / 2 - 15,
    y: canvas.height / 2 - 15,  // Colocando o sapo no centro da tela
    width: 30,
    height: 30,
    color: 'green',
    speed: 5,
    dx: 0,
    dy: 0
};

// Função para gerar obstáculos de forma aleatória
function createObstacle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 60,
        height: 20,
        speed: 2 + Math.random() * 3, // Velocidade aleatória
        direction: (Math.random() > 0.5 ? 1 : -1), // Direção aleatória
        color: getRandomColor()
    };
}

// Função para gerar cores aleatórias
function getRandomColor() {
    const colors = ['red', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'cyan'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Criando vários obstáculos
const obstacles = [];
for (let i = 0; i < 8; i++) {
    obstacles.push(createObstacle());
}

// Função para desenhar o sapo
function drawFrog() {
    ctx.fillStyle = frog.color;
    ctx.fillRect(frog.x, frog.y, frog.width, frog.height);
}

// Função para desenhar os obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para mover os obstáculos
function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed * obstacle.direction;

        // Quando o obstáculo sai da tela, ele reaparece na posição oposta
        if (obstacle.y + obstacle.height < 0) {
            obstacle.y = canvas.height;
            obstacle.x = Math.random() * canvas.width;
        } else if (obstacle.y > canvas.height) {
            obstacle.y = 0;
            obstacle.x = Math.random() * canvas.width;
        }
    });
}

// Função para movimentar o sapo
function moveFrog() {
    frog.x += frog.dx;
    frog.y += frog.dy;

    // Limita a movimentação do sapo dentro da tela
    if (frog.x < 0) frog.x = 0;
    if (frog.x + frog.width > canvas.width) frog.x = canvas.width - frog.width;

    // Rolagem infinita para cima e para baixo
    if (frog.y < 0) {
        frog.y = canvas.height - frog.height;
    }
    if (frog.y + frog.height > canvas.height) {
        frog.y = 0;
    }
}

// Função para controlar o movimento com as teclas
function control(e) {
    if (e.key === 'ArrowUp') {
        frog.dy = -frog.speed;
    } else if (e.key === 'ArrowDown') {
        frog.dy = frog.speed;
    } else if (e.key === 'ArrowLeft') {
        frog.dx = -frog.speed;
    } else if (e.key === 'ArrowRight') {
        frog.dx = frog.speed;
    }
}

// Função para parar o movimento
function stopMovement(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        frog.dy = 0;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        frog.dx = 0;
    }
}

// Função para verificar colisões
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (frog.x < obstacle.x + obstacle.width &&
            frog.x + frog.width > obstacle.x &&
            frog.y < obstacle.y + obstacle.height &&
            frog.y + frog.height > obstacle.y) {
            alert("Game Over! Você colidiu com um obstáculo!");
            resetGame();
        }
    });
}

// Função para reiniciar o jogo
function resetGame() {
    frog.x = canvas.width / 2 - 15;
    frog.y = canvas.height / 2 - 15;
    frog.dx = 0;
    frog.dy = 0;
}

// Função principal do jogo
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    drawFrog();
    moveFrog();
    drawObstacles();
    moveObstacles();
    checkCollisions();
    requestAnimationFrame(gameLoop); // Solicita a próxima atualização do quadro do jogo
}

// Inicia o jogo
document.addEventListener('keydown', control); // Adiciona o evento para quando uma tecla é pressionada
document.addEventListener('keyup', stopMovement); // Adiciona o evento para quando uma tecla é solta
gameLoop(); // Inicia o loop do jogo