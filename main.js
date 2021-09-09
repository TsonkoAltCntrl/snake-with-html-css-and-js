//etiquetas
const game = document.getElementById('game');
const screen = document.querySelector('.screen');
const play = document.getElementById('play');
const snake = [document.createElement('span')];
const food = document.createElement('span');
const score = document.querySelector('.score');
const root = document.querySelector(':root');
const speed = document.createElement('span');

//audio
const music = new Audio('./audio/snake-song.wav');
music.loop = true;

//declaraciones
const iniPosSnake = ['top', 52.5, 52.5];
const changeAnimation = 220;
const quitAnimation = 140;
let crtPosSnake = iniPosSnake.slice();
let movPosSnake = [];
let movTime = 500, puntuation = 0, count = 4, hueSnake = 0, bestPuntuation = 0, beforeKey = 0;
let currentKey, x, y, active;
let pause = false, targetPlay = false;

//agregar clases

food.classList.add('food');
snake[0].classList.add('snake', 'snake-head', 'top');
speed.classList.add('speed');

//funciones

function changePlaceFood() {
    let repeat = true;
    while (repeat) {
        repeat = false;
        x = 2.5 + (5 * (~~(Math.random() * 20)));
        y = 2.5 + (5 * (~~(Math.random() * 20)));
        snake.forEach(s => {
            if((parseFloat(s.style.top) === y) && (parseFloat(s.style.left) === x)) {
                repeat = true;
            }
        });
    }
    food.style.top = `${y}%`;
    food.style.left = `${x}%`;
}
function initial() {
    screen.classList.add('moveScreen');
    screen.appendChild(food);
    screen.appendChild(snake[0]);
    play.classList.replace('play-center','play-top-right');
    screen.appendChild(speed);
    score.classList.add('score__move');
    play.classList.add('play-stop');
}
function basic() {
    snake[0].style.top = `${crtPosSnake[1]}px`;
    snake[0].style.left = `${crtPosSnake[2]}px`;
    changePlaceFood();
}
function moveSnake() {
    switch(crtPosSnake[0]) {
        case 'top':
            movPosSnake = [-5, 0];
            break;
        case 'left':
            movPosSnake = [0, -5];
            break;
        case 'bottom':
            movPosSnake = [5, 0];
            break;
        case 'right':
            movPosSnake = [0, 5];
            break;
        default:
            alert('¿que haces aqui?');
            break;
    }
    crtPosSnake[1] += movPosSnake[0];
    crtPosSnake[2] += movPosSnake[1];
    snake[0].style.top = `${crtPosSnake[1]}%`;
    snake[0].style.left = `${crtPosSnake[2]}%`;
}

function moveBodySnake() {
    for(let i = puntuation; i > 0; i--) {
        {
            snake[i].style.top = snake[i - 1].style.top;
            snake[i].style.left = snake[i - 1].style.left;
        }
    }
}

function changeSnakeDirection() {
    switch(currentKey) {
        case 'ArrowUp':
        case 'KeyW':
            if(crtPosSnake[0] != 'bottom') {
                crtPosSnake[0] = 'top';
                snake[0].classList.replace('right', 'top');
                snake[0].classList.replace('left', 'top');
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if(crtPosSnake[0] != 'right') {
                crtPosSnake[0] = 'left';
                snake[0].classList.replace('top', 'left');
                snake[0].classList.replace('bottom', 'left');
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if(crtPosSnake[0] != 'top') {
                crtPosSnake[0] = 'bottom';
                snake[0].classList.replace('right', 'bottom');
                snake[0].classList.replace('left', 'bottom');
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if(crtPosSnake[0] != 'left') {
                crtPosSnake[0] = 'right';
                snake[0].classList.replace('top', 'right');
                snake[0].classList.replace('bottom', 'right');
            }
            break;
    }
}
function snakeAdd() {
    if(puntuation < snake.length) {
        snake[puntuation].classList.add('snake-end');
        snake[puntuation - 1].classList.remove('snake-end')
    }else {
        snake.push(document.createElement('span'));
        snake[snake.length - 2].classList.remove('snake-end');
        snake[snake.length - 1].classList.add('snake', 'snake-body', 'top', 'snake-end');
        screen.appendChild(snake[snake.length - 1]);
    }
}
function changeBodyDirection() {
    for(let i = puntuation; i > 0; i--) {
        snake[i].classList.remove('top', 'bottom', 'left', 'right');
        if(snake[i - 1].classList.contains('top')) {
            snake[i].classList.add('top');
        } else if (snake[i - 1].classList.contains('left')) {
            snake[i].classList.add('left');
        } else if (snake[i - 1].classList.contains('bottom')) {
            snake[i].classList.add('bottom');
        } else if (snake[i - 1].classList.contains('right')) {
            snake[i].classList.add('right');
        }
    }
}
function bodyIntersection() {
    for (let i = 1; i < puntuation; i++) {
        snake[i].classList.remove('snake-inter-right', 'snake-inter-left');
        if (snake[i].classList.contains('top')) {
            if (snake[i + 1].classList.contains('left')) {
                snake[i].classList.add('snake-inter-left');
            } else if (snake[i + 1].classList.contains('right')) {
                snake[i].classList.add('snake-inter-right');
            }
        } else if (snake[i].classList.contains('left')) {
            if (snake[i + 1].classList.contains('bottom')) {
                snake[i].classList.add('snake-inter-left');
            } else if (snake[i + 1].classList.contains('top')) {
                snake[i].classList.add('snake-inter-right');
            }
        } else if (snake[i].classList.contains('bottom')) {
            if (snake[i + 1].classList.contains('left')) {
                snake[i].classList.add('snake-inter-right');
            } else if (snake[i + 1].classList.contains('right')) {
                snake[i].classList.add('snake-inter-left');
            }
        } else if (snake[i].classList.contains('right')) {
            if (snake[i + 1].classList.contains('bottom')) {
                snake[i].classList.add('snake-inter-right');
            } else if (snake[i + 1].classList.contains('top')) {
                snake[i].classList.add('snake-inter-left');
            }
        }
    }
}
function snakeDeath() {
    for(let i = 1; i < puntuation; i++) {
        if(
            (crtPosSnake[1]  === parseFloat(snake[i].style.top)) &&
            (crtPosSnake[2] === parseFloat(snake[i].style.left))
        ) {
            active = false;
            play.style.zIndex = '60';
            play.classList.add('play__ani');
        }
    }
    if(
        (crtPosSnake[1]  < 2) || (crtPosSnake[2] < 2) ||
        (crtPosSnake[1]  > 98) || (crtPosSnake[2] > 98)
    ) {
        active = false;
        play.style.zIndex = '60';
        play.classList.add('play__ani');
    }
}

function gameOver() {
    play.classList.remove('play-play','play-stop');
    play.classList.add('play-retry');
    (bestPuntuation < puntuation) ? bestPuntuation = puntuation : null;
    
}
function timer() {
    snakeEats();
    if(!pause) {
        moveBodySnake();
        changeSnakeDirection();
        moveSnake();
        changeBodyDirection();
        bodyIntersection();
        snakeDeath();
        (active === true) ? setTimeout(() => {timer()}, movTime) : gameOver();
    }
}

function snakeEats() {
    if(
        (crtPosSnake[1]  === y) &&
        (crtPosSnake[2] === x)
        ) {
        changePlaceFood();
        puntuation ++;
        snakeAdd();
        if (count > 0) {
            count--;
        } else {
            count = 4;
            (movTime > 60) ? movTime -= 10 : null;
        }
        if(count === 0) {
            food.style.filter = "hue-rotate(110deg)";
        }else if (count === 4) {
            food.style.filter = "hue-rotate(0deg)";
            screen.classList.replace('moveScreen', 'screen-dif');
            score.classList.add('score-dif');
        } else if (count === 3) {
            screen.classList.replace('screen-dif', 'moveScreen');
            score.classList.remove('score-dif');
        }
        hueSnake += 35;
    }
    snake.forEach(s => {
        s.style.filter = `hue-rotate(${hueSnake}deg)`;
    });
    score.innerHTML = puntuation;
    speed.innerHTML=`velocidad: ${movTime}ms`;
}
function beginning() {
    active = true;
    initial();
    basic();
    timer();
    music.play();
}
function retry() {
    for(let i = 0; i < snake.length; i++) {
        snake[i].classList.remove('left','bottom','right');
        snake[i].classList.add('top');
        if(i > 0) {
            snake[i].style.top = '-10%';
            snake[i].style.left = '-10%';
        }
    }
    active = true;
    crtPosSnake = iniPosSnake.slice();
    puntuation = 0;
    movTime = 500;
    count = 4;
    hueSnake = 0;
    basic();
    timer();
    play.classList.replace('play-retry', 'play-stop');
}
function stop() {
    if(play.classList.contains('play-stop')) {
        pause = true;
        play.classList.replace('play-stop','play-play');
    }else if(play.classList.contains('play-play')) {
        pause = false;
        play.classList.replace('play-play','play-stop');
        timer();
    }else {
        retry();
    }
}
function codex() {
    if (beforeKey < 5) {
        if (currentKey === 'KeyY') {
            beforeKey = 1;
        } else if (currentKey === 'KeyI' && beforeKey === 1) {
            beforeKey = 2;
        } else if (currentKey === 'KeyS' && beforeKey === 2) {
            beforeKey = 3;
        } else if (currentKey === 'KeyU' && beforeKey === 3) {
            beforeKey = 4;
        } else if (currentKey === 'KeyS' && beforeKey === 4) {
            beforeKey = 5;
        }
    }else if (currentKey === 'KeyR') {
        beforeKey = 0;
        root.style.setProperty('--col-snake','#f05555');
        root.style.setProperty('--col-shadow','#ff88aa');
        root.style.setProperty('--col-part','#703010');
        root.style.setProperty('--col-eye-l','#010033');
        root.style.setProperty('--col-eye-r','#010033');
    }else if(beforeKey === 5) {
        root.style.setProperty('--col-snake','#e6f3f5');
        root.style.setProperty('--col-shadow','#bac6ca');
        root.style.setProperty('--col-part','#3f3f44');
        root.style.setProperty('--col-eye-l','#fa5555');
        root.style.setProperty('--col-eye-r','#5555fa');
    }
}
//evntos y intervalos

game.addEventListener('click', e => {
    if(e.target === play) {
        targetPlay = true;
        play.classList.contains('play-center') ? beginning() : stop();
    }else {
        targetPlay = false;
    }
});
document.addEventListener('keydown', e => {
    currentKey = e.code;
    codex();
    if(((currentKey === 'Space' || currentKey === 'Enter') && !(targetPlay)) || currentKey === 'Escape') {
        play.classList.contains('play-center') ? beginning() : stop();
    }
});
/* , onceSupported ? { once: true } : false */