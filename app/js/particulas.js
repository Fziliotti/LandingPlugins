class Particula {
    constructor(x,  y) {
        this.x = x || 0;
        this.y = y || 0;
        this.dx = 0;
        this.dy = 0;
        this.radius = RADIUS;
        this.color = COLOR;
        this.opacity = 1;
        this.aliveFor = 0;
        this.ttl = TTL;
        this.isAlive = true;
    }

    efeitoChuva() {
        // Acelerando particula a ACCpx/tick^2 quando a particula tiver viva por 30 frames (0.5s)
        if (this.aliveFor >= PERMANENCIA) {
            this.dx += Math.cos(SENTIDO) * ACC;
            this.dy += Math.sin(SENTIDO) * ACC;
        }

        let v = this.aliveFor / this.ttl;
        v = 1 - v;

        // Atualizando tamanho de acordo com "idade" da particula
        this.radius = v * RADIUS;

        // Atualizando opacidade
        this.opacity = Math.sin(Math.PI * v);
        this.opacity *= this.opacity;
    }

    update() {
        // Rodando efeito
        this["efeito" + EFEITO]();

        // Somando velocidade na posição
        this.x += this.dx;
        this.y += this.dy;

        // Aumentando tempo de vida
        this.aliveFor++;

        // Removendo se mais velha que o necessário
        if (this.aliveFor >= this.ttl)
            this.isAlive = false;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.TAU);
        ctx.fill();

        ctx.restore();
    }
}

(() => {
    const canvas = document.getElementById("particulas"),
        ctx = canvas.getContext("2d");

    const particulas = new Array();

    function frame() {
        // Atualizando tamanho
        if (canvas.width != canvas.clientWidth ||
            canvas.height != canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        // Limpando canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizando e desenhando particulas
        particulas.forEach(p => p.update());
        particulas.forEach(p => p.draw(ctx));

        // Particulas abaixo da tela morrem
        particulas.forEach(p => {
            if (p.y - p.radius > canvas.height)
                p.isAlive = false;
        });

        // Removendo particulas que devem ser removidas
        particulas.filter(p => !p.isAlive)
            .forEach(p => particulas.splice(particulas.indexOf(p), 1));

        // Nova particula
        particulas.push(new Particula(Math.random() * canvas.width, Math.random() * canvas.height));

        // Chamando próximo frame
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();


var RADIUS = 2;
var COLOR = "#989898";
var TTL = 60; // 60f = 1s pra maioria dos monitores
var ACC = .2; // Gravidade em px/frame^2
var EFEITO = "Chuva";
var SENTIDO = Math.PI/4 ;
var PERMANENCIA = 10;
Math.TAU = 2 * 3.141592653589793238462643383279502;


// ALTERNANCIA DE ANIMAÇÕES

var bg = document.querySelector(".intro");


var temas= [
    {sentido: Math.PI/4 },
    {sentido: Math.PI/2 },
    {sentido: Math.PI },
    {sentido: Math.PI*2 },
    {sentido: -Math.PI/4 },
]


function alterarAnimation() {
   var temasSize = temas.length;
   var numRandom = getRandom(temasSize) -1 ;
   var temaEscolhido = temas[numRandom];
   SENTIDO = temaEscolhido.sentido;
}
window.setInterval('alterarAnimation()', 4000);



function getRandom(max) {
    return Math.floor(Math.random() * max + 1)
}