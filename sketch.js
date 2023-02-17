var player;
var bg;
var outsideFrame;

var soundLines = [];
var soundPoints = [];
var soundZones = [];
var loadingSprite;
var hadFirstClick = false;
//the scene is twice the size of the canvas
var SCENE_W = 300;
var SCENE_H = 10000;
var CANVAS_W = 303;
var CANVAS_H = 503
var NAV_SPEED = 5
let fullScreen = true;
let canvas;


function preload() {
    soundFormats('mp3', 'ogg');

    if (fullScreen) {
        CANVAS_W = windowWidth;
        CANVAS_H = windowHeight;

    }
    outsideFrame = new Sprite(CANVAS_W / 2, CANVAS_H / 2, 'static');
    outsideFrame.addAnimation('assets/frame.png');
    outsideFrame.visible = false;

    var soundLine = new Soundline(1900, "assets/Marker1.mp3");
    soundLines.push(soundLine);

    var soundLine = new Soundline(3000, "assets/Marker3.mp3");
    soundLines.push(soundLine);

    var soundPoint = new SoundPoint(300, 200, 100, "assets/Marker3.mp3");
    soundPoints.push(soundPoint);

    var soundZone = new SoundZone(500, 1500, "assets/Marker3.mp3");
    soundZones.push(soundZone);

    player = new Sprite(CANVAS_W / 2, CANVAS_H / 2, 20, 20, 'none');
    player.addAnimation('assets/player.png');
    player.rotation = 0;

    bg = new Group();
    for (var i = 0; i < 80; i++) {
        var rock = new Sprite(random(-width, SCENE_W + width), random(-height, SCENE_H + height), 'none');
        rock.addAnimation('assets/stars' + i % 4 + '.png');
        bg.add(rock);
    }

    loadingSprite = new Sprite(CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 1.2, CANVAS_H, 'none')
    loadingSprite.text = 'click to start'
    loadingSprite.color = 'grey';
    loadingSprite.visible = true;
    loadingSprite.textSize = CANVAS_W / 30;
}
function setup() {

    canvas = createCanvas(CANVAS_W, CANVAS_H);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function draw() {
    if (hadFirstClick) {
        loadingSprite.visible = false;
        background(20);
        camera.on();

        var distance = createVector(player.position.x, player.position.y).sub(createVector(mouseX, mouseY))
        player.moveTo(mouse, NAV_SPEED * distance.mag() / CANVAS_H);

        camera.x = player.x;
        camera.y = player.y;

        if (player.position.x < 0)
            player.position.x = 0;
        if (player.position.y < 0)
            player.position.y = 0;
        if (player.position.x > SCENE_W)
            player.position.x = SCENE_W;
        if (player.position.y > SCENE_H)
            player.position.y = SCENE_H;

        bg.draw()
        for (soundLine of soundLines) {
            soundLine.display();
            soundLine.update();
        }

        for (soundPoint of soundPoints) {
            soundPoint.display();
            soundPoint.update();
        }

        for (soundZone of soundZones) {
            soundZone.display();
            soundZone.update();
        }

        player.draw();
        noStroke();
        fill(200);
        text(player.position.y.toFixed(0), player.position.x + 20, player.position.y);
        let fps = frameRate();
        text("FPS: " + fps.toFixed(0), player.position.x - 50, player.position.y - 40);

        loadingSprite.visible = false;
        camera.off();
    }

    outsideFrame.draw();
}

function touchStarted() {
    getAudioContext().resume()
    hadFirstClick = true;
}


function mousePressed() {
    hadFirstClick = true;
    camera.zoom = 0.1;
    NAV_SPEED *= 10;
}

function mouseReleased() {
    camera.zoom = 1;
    NAV_SPEED /= 10;
}