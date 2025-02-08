// Obtém o elemento canvas do documento e define o contexto 2D para desenhar
const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Carrega as imagens para o jogo
const ImagemSapo = new Image();
ImagemSapo.src = 'sapo.png';
const ImagemCaminhao = new Image();
ImagemCaminhao.src = 'caminhao.png';
const ImagemCarroRapido = new Image();
ImagemCarroRapido.src = 'carroRapido.png';
const ImagemCarro = new Image();
ImagemCarro.src = 'carro.png';
const ImagemTrator = new Image();
ImagemTrator.src = 'trator.png';

// Define as propriedades do sapo
const sapo = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    image: ImagemSapo,
    speed: 4,
    dx: 0,
    dy: 0
};

let pontos = 0;
let vidas = 3;

// Define os tipos de veículos e suas propriedades
const TiposVeiculos = [
    { image: ImagemCaminhao, speed: 2, width: 100, height: 30, direction: 1 },
    { image: ImagemCarroRapido, speed: 5, width: 60, height: 30, direction: -1 },
    { image: ImagemCarro, speed: 3, width: 70, height: 30, direction: 1 },
    { image: ImagemTrator, speed: 1, width: 120, height: 80, direction: -1 }
];

let dificuldade = 'medio';
const PosicoesIniciais = [];
const Veiculos = [];
const PosicoesYVeiculos = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550];

// Função para configurar a dificuldade
function selecionarDificuldade() {
    const seletorDificuldade = document.getElementById('SeletorDificuldade');
    dificuldade = seletorDificuldade.value;
    if (dificuldade === 'facil') {
        TiposVeiculos[0].speed = 1.6; // Caminhão
        TiposVeiculos[1].speed = 4;   // Carro rápido
        TiposVeiculos[2].speed = 2.4; // Carro
        TiposVeiculos[3].speed = 0.8; // Trator
    } else if (dificuldade === 'medio') {
        TiposVeiculos.forEach(type => type.speed = type.speed);
    } else if (dificuldade === 'dificil') {
        TiposVeiculos[0].speed = 3;   // Caminhão
        TiposVeiculos[1].speed = 7.5; // Carro rápido
        TiposVeiculos[2].speed = 4.5; // Carro
        TiposVeiculos[3].speed = 1.5; // Trator
    }
}

// Função para gerar as posições iniciais dos obstáculos
function gerarPosicoes() {
    const posicoes = [
        { type: 0, x: 100, y: 100 },
        { type: 0, x: 400, y: 100 },
        { type: 1, x: 100, y: 150 },
        { type: 1, x: 400, y: 150 },
        { type: 2, x: 100, y: 200 },
        { type: 2, x: 400, y: 200 },
        { type: 3, x: 200, y: 250 }
    ];
    posicoes.forEach((pos, idx) => {
        Veiculos.push(criarVeiculos(pos.x, pos.y, TiposVeiculos[pos.type]));
        PosicoesIniciais.push({ x: pos.x, y: pos.y });
    });
    Veiculos.push(criarVeiculos(450, 350, TiposVeiculos[2]));
    Veiculos.push(criarVeiculos(100, 400, TiposVeiculos[1]));
    PosicoesIniciais.push({ x: 450, y: 350 });
    PosicoesIniciais.push({ x: 100, y: 400 });
}

// Função para criar um veículo
function criarVeiculos(x, y, type) {
    return { x: x, y: y, width: type.width, height: type.height, speed: type.speed, image: type.image, direction: type.direction };
}

// Função para desenhar o sapo na tela
function desenharSapo() {
    ctx.drawImage(sapo.image, sapo.x, sapo.y, sapo.width, sapo.height);
}

// Função para desenhar os veículos na tela
function desenharVeiculos() {
    Veiculos.forEach(obstacle => {
        const proporcaoImagem = obstacle.image.width / obstacle.image.height;
        const larguraEscalada = obstacle.width;
        const alturaEscalada = larguraEscalada / proporcaoImagem;
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, larguraEscalada, alturaEscalada);
    });
}

// Função para desenhar o painel de pontuação e vidas
function desenharPainel() {
    ctx.fillStyle = '#505050';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#72c026';
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    ctx.fillStyle = 'black';
    ctx.font = '20px Trebuchet MS';
    ctx.textAlign = 'left'; // Garante que o texto fique alinhado à esquerda
    ctx.fillText(`Pontuação: ${pontos}`, 20, 30);
    ctx.textAlign = 'right'; // Garante que o texto fique alinhado à direita
    ctx.fillText(`Vidas: ${vidas}`, canvas.width - 60, 30);
}

// Função para mover os veículos
function moverVeiculos() {
    Veiculos.forEach(obstacle => {
        obstacle.x += obstacle.speed * obstacle.direction;
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
        } else if (obstacle.x > canvas.width) {
            obstacle.x = -obstacle.width;
        }
    });
}

// Função para mover o sapo
function moverSapo() {
    sapo.x += sapo.dx;
    sapo.y += sapo.dy;
    if (sapo.x < 0) sapo.x = 0;
    if (sapo.x + sapo.width > canvas.width) sapo.x = canvas.width - sapo.width;
    if (sapo.y < 50) sapo.y = 50;
    if (sapo.y + sapo.height > canvas.height - 50) sapo.y = canvas.height - 50 - sapo.height;
}

// Função para controlar o movimento do sapo com as setas do teclado
function controle(e) {
    if (e.key === 'ArrowUp') { sapo.dy = -sapo.speed; }
    else if (e.key === 'ArrowDown') { sapo.dy = sapo.speed; }
    else if (e.key === 'ArrowLeft') { sapo.dx = -sapo.speed; }
    else if (e.key === 'ArrowRight') { sapo.dx = sapo.speed; }
}

// Função para parar o movimento
function pararMovimento(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { sapo.dy = 0; }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { sapo.dx = 0; }
}

// Função para verificar colisões com obstáculos
function checarColisoes() {
    Veiculos.forEach(obstacle => {
        if (sapo.x < obstacle.x + obstacle.width && sapo.x + sapo.width > obstacle.x &&
            sapo.y < obstacle.y + obstacle.height && sapo.y + sapo.height > obstacle.y) {
            // Reduz a pontuação e as vidas quando há uma colisão
            pontos -= 200;
            if (pontos < 0) pontos = 0;
            vidas -= 1;
            voltar();
            if (vidas <= 0) {
                // Se as vidas acabaram, parar o jogo
                fimDeJogo();
            }
        }
    });
}

// Função para aumentar a pontuação
function aumentarPontuacao() {
    if (sapo.y <= 50) {
        // Aumenta a pontuação ao alcançar o topo da tela
        pontos += 100;
        voltar();
        if (pontos >= 1000) {
            // Ganha uma vida extra a cada 1000 pontos
            vidas += 1;
            pontos -= 1000;
        }
    }
}

// Função para parar o jogo e exibir "Game Over"
function fimDeJogo() {
    cancelAnimationFrame(IdLoopJogo); // Para o loop de animação
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Exibe a mensagem de "Game Over"
    ctx.fillStyle = 'black';
    ctx.font = '50px Trebuchet MS';
    ctx.textAlign = 'center';
    ctx.fillText('Fim de Jogo', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Trebuchet MS';
    ctx.fillText(`Pontuação Final: ${pontos}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Pressione "Reiniciar jogo" para jogar novamente`, canvas.width / 2, canvas.height / 2 + 50);

    document.getElementById('SeletorDificuldade').disabled = false;

    // Altera do botão de iniciar para o botão de reiniciar
    alterarBotoes()
}

// Altera do botão de iniciar para o botão de reiniciar
function alterarBotoes() {
    var botaoIniciar = document.getElementById('BotaoIniciar');
    botaoIniciar.style.display = 'none';
    var botaoReiniciar = document.getElementById('BotaoReiniciar');
    botaoReiniciar.style.display = 'block';
};

// Função para voltar o jogo ao começo quando o sapo atravessa a rua
function voltar(volte = false) {
    // Reposiciona o sapo no ponto inicial
    sapo.x = canvas.width / 2 - 20;
    sapo.y = canvas.height - 60;
    sapo.dx = 0;
    sapo.dy = 0;

    // Reposiciona os obstáculos
    Veiculos.forEach((obstacle, idx) => {
        obstacle.x = PosicoesIniciais[idx].x;
        obstacle.y = PosicoesIniciais[idx].y;
    });

    if (volte) {
        pontos = 0;
        vidas = 3;
    }
}

let IdLoopJogo;

// Função que gerencia o loop de animação
function loopJogo() {
    if (vidas > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        desenharPainel();
        desenharSapo();
        moverSapo();
        desenharVeiculos();
        moverVeiculos();
        checarColisoes();
        aumentarPontuacao();
        IdLoopJogo = requestAnimationFrame(loopJogo);
    }
}

// Função para iniciar o jogo
function iniciarJogo() {
    document.getElementById('BotaoIniciar').disabled = true;
    document.getElementById('SeletorDificuldade').disabled = true;
    selecionarDificuldade();
    gerarPosicoes();
    loopJogo();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    cancelAnimationFrame(IdLoopJogo); // Para o loop de animação
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Redefine as variáveis do jogo
    pontos = 0;
    vidas = 3;

    sapo.x = canvas.width / 2 - 20;
    sapo.y = canvas.height - 60;
    sapo.dx = 0;
    sapo.dy = 0;

    Veiculos.length = 0; // Limpa a lista de obstáculos

    document.getElementById('SeletorDificuldade').disabled = true;
    selecionarDificuldade();
    gerarPosicoes();
    loopJogo();
}

// Função para reiniciar o jogo ao clicar no botão de reiniciar
document.getElementById('BotaoReiniciar').addEventListener('click', () => {
    reiniciarJogo();
});

document.getElementById('BotaoIniciar').addEventListener('click', () => {
    iniciarJogo();
});

document.addEventListener('keydown', controle);
document.addEventListener('keyup', pararMovimento);