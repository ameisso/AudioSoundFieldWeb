var player;
var bg;
var xml;

var soundLines = [];
var soundPoints = [];
var soundZones = [];
var loadingSprite;
var debugSprite;
var worldBorderSprite;
var hadFirstClick = false;
var isTouchableDevice = false;
//the scene is twice the size of the canvas
var SCENE_W = 3000;
var SCENE_H = 10000;
var CANVAS_W = 303;
var CANVAS_H = 503
var NAV_SPEED = 3
var preloadDistance = SCENE_H;
let fullScreen = true;
let debug = false;
var assetsLoaded = false;
let canvas;


function preload() {
    soundFormats('mp3', 'ogg');
    xml = loadXML('assets/project.xml', loadAssets);
}

function loadAssets() {
    let sceneXML = xml.getChild('scene');
    if (sceneXML.getNum('fullscreen')) {
        CANVAS_W = windowWidth;
        CANVAS_H = windowHeight;
    }

    SCENE_W = sceneXML.getNum('width')
    SCENE_H = sceneXML.getNum('height')
    if (sceneXML.getNum('debug') == 1) {
        debug = true;
    }

    let playerXML = xml.getChild('player')
    NAV_SPEED = playerXML.getNum('speed')
    preloadDistance = playerXML.getNum('preloadDistance')
    var playerX = playerXML.getNum('startX');
    var playerY = playerXML.getNum('startY')
    player = new Sprite(playerX, playerY, 20, 20, 'none');
    player.addAnimation('assets/player.png');
    player.rotation = 0;

    let soundLineXML = xml.getChildren('soundLine');
    for (let i = 0; i < soundLineXML.length; i++) {
        let posY = soundLineXML[i].getNum('y');
        let filePath = "assets/" + soundLineXML[i].getString('fileName');
        var soundLine = new Soundline(posY, filePath);
        soundLines.push(soundLine);
    }

    let soundPointsXML = xml.getChildren('soundPoint');
    for (let i = 0; i < soundPointsXML.length; i++) {
        let posX = soundPointsXML[i].getNum('x');
        let posY = soundPointsXML[i].getNum('y');
        let radius = soundPointsXML[i].getNum('r');
        let filePath = "assets/" + soundPointsXML[i].getString('fileName');
        var soundPoint
        if (soundPointsXML[i].getString('associatedImage')) {
            soundPoint = new SoundPoint(posX, posY, radius, filePath, "assets/" + soundPointsXML[i].getString('associatedImage'));
        }
        else {
            soundPoint = new SoundPoint(posX, posY, radius, filePath);
        }
        soundPoints.push(soundPoint);
    }

    let soundZoneXML = xml.getChildren('soundZone');
    for (let i = 0; i < soundZoneXML.length; i++) {
        let startY = soundZoneXML[i].getNum('startY');
        let endY = soundZoneXML[i].getNum('endY');
        let filePath = "assets/" + soundZoneXML[i].getString('fileName');
        var soundZone = new SoundZone(startY, endY, filePath);
        soundZones.push(soundZone);
    }


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
    let version = sceneXML.getString('version')
    debugSprite = new Sprite(CANVAS_W - 30, CANVAS_H - 15, 60, 30, 'none')
    debugSprite.text = version
    debugSprite.color = 'grey';
    debugSprite.visible = true;
    debugSprite.textSize = CANVAS_W / 50;
    worldBorderSprite = new Sprite(SCENE_W / 2, SCENE_H / 2, SCENE_W, SCENE_H, 'none');
    let c = color('blue');
    c.setAlpha(0);
    worldBorderSprite.color = c
    worldBorderSprite.strokeWeight = 10;
    worldBorderSprite.stroke = 'blue'
    worldBorderSprite.visible = false;

    assetsLoaded = true;
}
function setup() {
    canvas = createCanvas(CANVAS_W, CANVAS_H);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function draw() {
    if (hadFirstClick && assetsLoaded) {
        loadingSprite.visible = false;
        background(20);
        camera.on();

        if (isTouchableDevice) {
            player.moveTo(mouse);

        }
        else {
            player.moveTo(mouse, NAV_SPEED);
        }

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
        if (debug) {
            noStroke();
            fill(200);
            textSize(CANVAS_W / 30);
            var positionText = player.position.x.toFixed(0) + " " + player.position.y.toFixed(0)
            text(positionText, player.position.x + 20, player.position.y);
            let fps = frameRate();
          //  text("FPS: " + fps.toFixed(0), player.position.x - 50, player.position.y - 40);
            worldBorderSprite.draw();
        }

        camera.off();
    }
}

function touchStarted() {
    getAudioContext().resume()
    hadFirstClick = true;
    isTouchableDevice = true;
}

function mousePressed() {
    hadFirstClick = true;
    camera.zoom = 0.1;
    NAV_SPEED *= 10;
    isTouchableDevice = false;
}

function mouseReleased() {
    camera.zoom = 1;
    NAV_SPEED /= 10;
}

function keyPressed() {
    if (key == 'd') {
        debug = !debug
    }
    //  return false; // prevent any default behaviour
}