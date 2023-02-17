var player;
var bg;
var outsideFrame;
var xml;

var soundLines = [];
var soundPoints = [];
var soundZones = [];
var loadingSprite;
var hadFirstClick = false;
//the scene is twice the size of the canvas
var SCENE_W = 3000;
var SCENE_H = 10000;
var CANVAS_W = 303;
var CANVAS_H = 503
var NAV_SPEED = 3
var preloadDistance = SCENE_H;
let fullScreen = true;
let debug = false;
let canvas;


function preload() {
    soundFormats('mp3', 'ogg');
    xml = loadXML('assets/project.xml', loadAssets);
}

function loadAssets() {

    let sceneXML = xml.getChild('scene');
    let playerXML = xml.getChild('player')
    NAV_SPEED = playerXML.getNum('speed')
    preloadDistance = playerXML.getNum('preloadDistance')
    if (sceneXML.getNum('fullscreen')) {
        CANVAS_W = windowWidth;
        CANVAS_H = windowHeight;
    }

    SCENE_W = sceneXML.getNum('width')
    SCENE_H = sceneXML.getNum('height')

    outsideFrame = new Sprite(CANVAS_W / 2, CANVAS_H / 2, 'static');
    outsideFrame.addAnimation('assets/frame.png');
    outsideFrame.visible = false;

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

    player = new Sprite(playerXML.getNum('startX'), playerXML.getNum('startY'), 20, 20, 'none');
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

function keyPressed() {
    if (key == 'd') {
        debug = !debug
    }
    return false; // prevent any default behaviour
}