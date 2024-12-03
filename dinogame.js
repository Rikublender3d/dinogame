const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageNames = ['bird', 'cactus', 'dino'];

// グローバルな game オブジェクト
const game = {
    counter: 0,
    backGrounds: [],
    bgm1: new Audio('bgm/fieldSong.mp3'),
    bgm2: new Audio('bgm/jump.mp3'),
    enemys: [],
    enemyCountdown: 0,
    image: {},
    score: 0,
    state:'loading',
    timer: null
};
game.bgm1.loop = true;
// 複数画像読み込み
let imageLoadCounter = 0;
for (const imageName of imageNames) {
    const imagePath = `image/${imageName}.png`;
    game.image[imageName] = new Image();
    game.image[imageName].src = imagePath;
    game.image[imageName].onload = () => {
        imageLoadCounter += 1;
        if (imageLoadCounter === imageNames.length) {
            init();
        }
    }
}

function init() {
  game.counter = 0;
  game.enemys = [];
  game.enemyCountdown = 0;
  game.score = 0;
  game.state = 'init';
  // 画面クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 恐竜の表示
  createDino();
  drawDino();
  // 背景の描画
  createBackGround();
  drawBackGrounds();
  // 文章の表示
  ctx.fillStyle = 'black';
  ctx.font = 'bold 60px serif';
  ctx.fillText(`Press Space key`, 60, 150);
  ctx.fillText(`to start.`, 150, 230);
}
function start(){
  game.state = 'gaming';
  game.bgm1.play();
  game.timer = setInterval(ticker, 30);
}
function ticker() {
    // 画面クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(game.counter %10 === 0){
        createBackGround();
    }
    // 敵キャラクターの生成
    createEnemys();

    // キャラクターの移動
    moveBackGrounds(); // 背景の描画
    moveDino(); // 恐竜の移動
    moveEnemys(); // 敵キャラクターの移動

    //描画
    drawBackGrounds(); // 背景の描画
    drawDino();// 恐竜の描画
    drawEnemys(); // 敵キャラクターの描画
drawScore();
    // TODO あたり判定
    hitCheck();
    // カウンターの更新
    game.score +=1;
    game.enemyCountdown -= 1;
    game.counter = (game.counter + 1) % 1000000;
}

function createDino() {
    game.dino = {
        x: game.image.dino.width / 2,
        y: canvas.height - game.image.dino.height / 2,
        moveY: 0,
        width: game.image.dino.width,
        height: game.image.dino.height,
        image: game.image.dino
    }
}
function createBackGround() {
  for (let x = 0; x <= canvas.width; x += 200){
    game.backGrounds.push({
        x: x,
        y:canvas.height,
        width: 200,
        moveX:-20,
    })
  }
}
function moveBackGrounds() {
  for (const backGround of game.backGrounds) {
      backGround.x += backGround.moveX;
  }
}
function drawBackGrounds() {
  ctx.fillStyle = 'sienna';
  for (const backGround of game.backGrounds) {
    ctx.fillRect(backGround.x, backGround.y - 5, backGround.width, 5);
    ctx.fillRect(backGround.x + 20, backGround.y - 10, backGround.width - 40, 5);
    ctx.fillRect(backGround.x + 50, backGround.y - 15, backGround.width - 100, 5);
  }
}


function createCactus(createX) {
    game.enemys.push({
        x:createX,
        y: canvas.height - game.image.cactus.height / 2,
        width: game.image.cactus.width,
        height: game.image.cactus.height,
        moveX: -10,
        image: game.image.cactus
    });
}

function createBird() {
    const birdY = Math.random() * (300 - game.image.bird.height) + 150;
    game.enemys.push({
        x: canvas.width + game.image.bird.width / 2,
        y: birdY,
        width: game.image.bird.width,
        height: game.image.bird.height,
        moveX: -15,
        image: game.image.bird
    });
}

function moveDino() {
    game.dino.y += game.dino.moveY;
    if (game.dino.y >= canvas.height - game.dino.height / 2) {
        game.dino.y = canvas.height - game.dino.height / 2;
        game.dino.moveY = 0;
    } else {
        game.dino.moveY += 3;
    }
}

function moveEnemys() {
    for (const enemy of game.enemys) {
        enemy.x += enemy.moveX;
    }
    // 画面の外に出たキャラクターを配列から削除
    game.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
}

function drawDino() {
    ctx.drawImage(game.image.dino, game.dino.x - game.dino.width / 2, game.dino.y - game.dino.height / 2);
}

function drawEnemys() {
    for (const enemy of game.enemys) {
        ctx.drawImage(enemy.image, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
    }
}
function drawScore() {
  ctx.fillStyle = 'black';
ctx.font = '24px serif';
ctx.fillText(`Score: ${game.score}`,0,30);
}
document.onkeydown = function(e) {
    if(e.key === ' ' && game.state === 'init') {
      start();
    }
    if (e.key === ' ' && game.dino.moveY === 0) {
      game.dino.moveY = -41;
        game.bgm2.play();
    }
    if (e.code === 'Enter' && game.state === 'gameover') {
        init();
    }
};
function hitCheck(){
  for (const enemy of game.enemys) {
    if (Math.abs(game.dino.x - enemy.x) < game.dino.width / 2 + enemy.width / 2 &&
      Math.abs(game.dino.y- enemy.y) < game.dino.height / 2 + enemy.height / 2) 
        {
          game.state = 'gameover';
          game.bgm1.pause();
            ctx.fillStyle = 'black';
            ctx.font = 'bold 100px serif';
            ctx.fillText('Game Over', 150, 200);
            clearInterval(game.timer);
        }
}
}
function createEnemys() {
  if (game.enemyCountdown === 0) {
    game.enemyCountdown = 60 - Math.floor(game.score / 100);
    if (game.enemyCountdown <=30) game.enemyCountdown = 30;
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        createCactus(canvas.width + game.image.cactus.width/2);
        break;
      case 1:
        createCactus(canvas.width + game.image.cactus.width / 2);
        createCactus(canvas.width + game.image.cactus.width * 3 / 2);
        break;
      case 2:
        createBird();
        break;
    }
  }
}
